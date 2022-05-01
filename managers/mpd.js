const mpd = require('mpd2')
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
    ADD: "add"
}

class MpdManager {
    confisg = {
        host: "localhost",
        port: '6600'          
    }
    config = {
        host: "192.168.2.4",
        port: '6600'          
    }

    progressInterval = null;
    client = null;
    status = null;
    playlist = null;
    current = null;
    pool = null;

    async run() {
        this.client = await mpd.connect(this.config)

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
        if (this.pool === null || req.body.refresh === true) {
            const lsAllParser = mpd.parseListAndAccumulate(['directory', 'file'])
            const lsAllString = await this.client.sendCommand('listallinfo')     
            this.pool = lsAllParser(lsAllString)  
        }

        return this.pool;
    }

    async [COMMANDS.VOLUME](req) {
        const volume = req.body.volume

        await this.client.sendCommand(`setvol ${volume}`).then(mpd.parseObject)    
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
        const filePath = req.body.path;

        await this.client.sendCommand(`add ${filePath}`).then(mpd.parseObject);   

        this[COMMANDS.STATUS]()
    }
}

const mpdManager = new MpdManager()
mpdManager.COMMANDS = COMMANDS

module.exports = mpdManager;
