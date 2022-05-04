const mpd = require('mpd2');
const socket = require('./../socket');

const COMMANDS = {
    SEEK: {label: 'seek', command: 'seekcur', auto: true},
    VOLUME: {label: 'setVolume', command: 'setvol', auto: true},
    NEXT: {label: 'next', auto: true},
    PLAY: {label: 'play', auto: true},
    PAUSE: {label: 'pause', auto: true},
    CLEAR: {label: "clear", auto: true},
    UPDATE: {label: "update", auto: true},
    MOVE_ID: {label: "moveid", auto: true},
    SHUFFLE: {label: 'shuffle', auto: true},
    REPEAT: {label: 'repeat', toggle: true},
    RANDOM: {label: 'random', toggle: true},
    PREVIOUS: {label: 'previous', auto: true},
    CONSUME: {label: 'consume', toggle: true},
    DELETE_ID: {label: "deleteid", auto: true},
    VOLUME_UP: {label: 'setVolumeUp'},
    VOLUME_DOWN: {label: 'setVolumeDown'},
    STATUS: {label: 'getStatus'},
    DATABASE: {label: 'database'},
    ADD: {label: "add"},
}

class MpdManager {
    progressInterval = null;
    client = null;
    status = null;
    playlist = null;
    current = null;
    pool = null;

    constructor() {
        Object.values(COMMANDS).filter(i => i.auto === true || i.toggle === true).forEach(command => {
            this[command.label] = async req => {
                try {
                    let args = req.body.params || [];
                    
                    if (command.toggle === true) {
                        args = (this.status?.[command.label] || false) === false ? 1 : 0;
                    }

                    await this.client.sendCommand(mpd.cmd(command.command ? command.command : command.label, args))
                    
                    if (command.toggle === true) {
                        this.getStatus()
                    }
                } catch (e) {
                    return {valid: false};
                }
            }
        })
    }

    async run(reset = false) {
        if (reset === true) {
            await this.client?.disconnect?.();
        }

        const configs = require('./../data/server.json')
        const config = configs.find(i => i.default === true)
        const refreshStatus = () => this.getStatus()

        try {
            await this.client?.disconnect?.();
            this.client = await mpd.connect(config)
            socket.emit('server_connection_error', null)
            this.client.on('system', (...args) => this.onSystem(...args))
            this.client.on('system-player', refreshStatus)
            this.client.on('system-mixer', refreshStatus)
            this.client.on('system-playlist', refreshStatus)
            this.getStatus();
            this.database();
    
            this.progressInterval = async () => {
                try {

                    if (this.fullStatus?.state === 'play') {
                        const status = await this.client.sendCommand('status').then(mpd.parseObject);
                        delete status.playlist_info;
                        const newStatus = {...this.fullStatus, ...status}
                        this.fullStatus = newStatus;
                        socket.emit('mpd_status', newStatus)
                    }
                } catch(e) {
                    console.log(e)
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

    async [COMMANDS.STATUS.label]() {
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

    async [COMMANDS.DATABASE.label](req) {
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

    async [COMMANDS.VOLUME_UP.label]() {
        let newVolume = this.status.volume + 10
        if (newVolume > 100) {
            newVolume = 100;
        }

        await this.client.sendCommand(`setvol ${newVolume}`).then(mpd.parseObject)    
    }

    async [COMMANDS.VOLUME_DOWN.label]() {
        let newVolume = this.status.volume - 10
        if (newVolume < 0) {
            newVolume = 0;
        }

        await this.client.sendCommand(`setvol ${newVolume}`).then(mpd.parseObject)    
    }

    async [COMMANDS.ADD.label](req) {
        const {path:filePath , play, clear} = req.body;

        if (clear === true) {
            await this.client.sendCommand('clear');
        }

        await this.client.sendCommand(mpd.cmd('add', filePath)).then(mpd.parseObject);   

        if (play === true) {
            await this.client.sendCommand(`play`).then(mpd.parseObject); 
        }

        this[COMMANDS.STATUS.label]()
    }
}

const mpdManager = new MpdManager()
mpdManager.COMMANDS = COMMANDS

module.exports = mpdManager;
