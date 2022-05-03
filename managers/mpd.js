const mpd = require('mpd2');
const { Server } = require('socket.io');
const socket = require('./../socket')
const { cmd } = mpd

const COMMANDS = {
    VOLUME: 'setVolume',
    VOLUME_UP: 'setVolumeUp',
    VOLUME_DOWN: 'setVolumeDown',
    NEXT: 'next',
    PREVIOUS: 'previous',
    PLAY: 'play',
    PAUSE: 'pause',
    STATUS: 'getStatus',
    SEEK: 'seek',
    SHUFFLE: 'shuffle',
    REPEAT: 'repeat',
    RANDOM: 'random',
    DATABASE: 'database',
    ADD: "add",
    UPDATE: "update",
    CLEAR: "clear"
}

class MpdManager {
    progressInterval = null;
    client = null;
    status = null;
    playlist = null;
    current = null;
    pool = null;

    async run(reset = false) {
        if (reset === true) {
            await this.client?.disconnect?.();
        }

        const configs = require('./../data/server.json')
        const config = configs.find(i => i.default === true)

        try {
            await this.client?.disconnect?.();
            this.client = await mpd.connect(config)
            socket.emit('server_connection_error', null)
            this.client.on('system', (...args) => this.onSystem(...args))
            this.client.on('system-player', (...args) => this.onSystemPlayer(...args))
            this.client.on('system-mixer', (...args) => this.onSystemMixer(...args))
            this.client.on('system-playlist', (...args) => this.onSystemPlaylist(...args))
            this.getStatus();
            this.database();
    
            this.progressInterval = async () => {
                if (this.fullStatus?.state === 'play') {
                    const status = await this.client.sendCommand('status').then(mpd.parseObject);
                    delete status.playlist_info;
                    const newStatus = {...this.fullStatus, ...status}
                    this.fullStatus = newStatus;
                    socket.emit('mpd_status', newStatus)
                }
    
                setTimeout(() => {
                    this.progressInterval();
                }, 500)
            }
    
            this.progressInterval();
        } catch(e) {
            socket.emit('server_connection_error', {host: config.host, port: config.port})
            setTimeout(() => this.run(), 1000)
        }
    }

    async [COMMANDS.STATUS]() {
        const [status, playlist] = await Promise.all([
            this.client.sendCommand('status').then(mpd.parseObject),
            this.client.sendCommand('playlistinfo').then(mpd.parseList)
        ]);
        this.status = status;   
        this.playlist = playlist;  
        this.current = null;

        if (this.status.songid) {
            this.current = await this.client.sendCommand(`playlistid ${this.status.songid}`).then(mpd.parseObject)  
        }   

        this.fullStatus = {
            ...this.status, 
            playlist_info: this.playlist,
            current: this.current
        }

        socket.emit('mpd_status', this.fullStatus)

        return this.fullStatus
    }

    async onSystem(s) {
        console.log(s)
    }

    async onSystemPlayer() {
        this.getStatus()
    }

    async onSystemPlaylist() {
        this.getStatus()
    }

    async onSystemMixer() {
        this.getStatus()
    }

    async [COMMANDS.DATABASE](req) {
        if (this.pool === null || req?.body?.refresh === true) {
            const lsAllParser = mpd.parseListAndAccumulate(['directory', 'file'])
            const lsAllString = await this.client.sendCommand('listallinfo')     
            const pool = lsAllParser(lsAllString)
            
            let processedFolder = []
            let newPool = []
            const cleanFilter = i => i !== null && i !== undefined

            const nestThePool = (poolItem) => {
                if (processedFolder.indexOf(poolItem.directory) !== -1) {
                    return undefined
                }

                const children = pool
                    .filter(i => i.directory.indexOf(poolItem.directory) === 0 && i.directory !== poolItem.directory)
                    .map(child => nestThePool(child))
                    .filter(cleanFilter)

                children.forEach(i => processedFolder.push(i.directory))

                const newItem = {
                    ...poolItem,
                    directories: children
                }

                processedFolder.push(poolItem.directory);

                return newItem;                    
            }

            newPool = pool.map(item => nestThePool(item)).filter(cleanFilter)

            this.pool = newPool;
        }

        return this.pool;
    }

    async [COMMANDS.VOLUME](req) {
        const volume = req.body.volume

        await this.client.sendCommand(`setvol ${volume}`).then(mpd.parseObject)    
    }

    async [COMMANDS.UPDATE]() {
        await this.client.sendCommand('update');
    }

    async [COMMANDS.VOLUME_UP]() {
        let newVolume = this.status.volume + 10
        if (newVolume > 100) {
            newVolume = 100;
        }

        await this.client.sendCommand(`setvol ${newVolume}`).then(mpd.parseObject)    
    }

    async [COMMANDS.VOLUME_DOWN]() {
        let newVolume = this.status.volume - 10
        if (newVolume < 0) {
            newVolume = 0;
        }

        await this.client.sendCommand(`setvol ${newVolume}`).then(mpd.parseObject)    
    }
    async [COMMANDS.NEXT]() {
        await this.client.sendCommand('next').then(mpd.parseObject);   
    }
    async [COMMANDS.SEEK](req) {
        const percent = req.body.percent;
        await this.client.sendCommand(`seekcur ${percent}`).then(mpd.parseObject);   
    }
    async [COMMANDS.PREVIOUS]() {
        await this.client.sendCommand('previous').then(mpd.parseObject);   
    }
    async [COMMANDS.PLAY](req) {
        const index = req.body.index || '';
        await this.client.sendCommand(`play ${index}`).then(mpd.parseObject);   
    }
    async [COMMANDS.PAUSE]() {
        await this.client.sendCommand('pause').then(mpd.parseObject);   
    }
    async [COMMANDS.SHUFFLE]() {
        await this.client.sendCommand('shuffle').then(mpd.parseObject);   
    }
    async [COMMANDS.CLEAR]() {
        await this.client.sendCommand('clear');
    }
    async [COMMANDS.REPEAT]() {
        const newStatus = (this.status?.repeat || false) === false ? 1 : 0;
        await this.client.sendCommand(`repeat ${newStatus}`).then(mpd.parseObject);   
        this[COMMANDS.STATUS]()
    }
    async [COMMANDS.RANDOM]() {
        const newStatus = (this.status?.random || false) === false ? 1 : 0;
        await this.client.sendCommand(`random ${newStatus}`).then(mpd.parseObject);   
        this[COMMANDS.STATUS]()
    }

    async [COMMANDS.ADD](req) {
        const {path:filePath , play, clear} = req.body;

        if (clear === true) {
            await this.client.sendCommand('clear');
        }

        await this.client.sendCommand(mpd.cmd('add', filePath)).then(mpd.parseObject);   

        if (play === true) {
            await this.client.sendCommand(`play`).then(mpd.parseObject); 
        }

        this[COMMANDS.STATUS]()
    }
}

const mpdManager = new MpdManager()
mpdManager.COMMANDS = COMMANDS

module.exports = mpdManager;
