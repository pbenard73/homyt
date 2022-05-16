import listener, { EVENTS } from "./listener"

export const STATE = {
    PLAYING: 'playing',
    STOP: 'stop',
    PAUSE: 'pause',
}

class Player {
    state = STATE.STOP
    context = null
    playlistIndex=0
    playlist=[]
    audioContext=null
    gainNode=null
    source=null
    volume=1;

    resetContext() {
        this.context = null;
        if (this.gainNode !== null) {
            this.gainNode.disconnect();
        }

        return this.getContext()
    }

    getContext() {
        if (this.context === null) {
            const audioElement = document.querySelector('#casper_video')

            const canvas = document.querySelector('#spectrum_canvas')
            const canvas3d = document.querySelector('#spectrum3d_canvas')

            if (this.source === null) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.source = this.audioContext.createMediaElementSource(audioElement);
            }


            var analyzer = this.audioContext.createAnalyser();
            this.gainNode = this.audioContext.createGain();
            
            this.source.connect(this.gainNode );
            this.source.connect(analyzer  );

            this.gainNode.connect(this.audioContext.destination);

            this.context = {
                audioContext: this.audioContext, gainNode: this.gainNode, analyzer, canvas, canvas3d
            }
        }

        return this.context
    }

    setPlaylistIndex(index) {
        this.playlistIndex = index
    }

    setPlaylist(playlist) {
        this.playlist = playlist 
    }

    getPlaylistIndex() {
        return this.playlistIndex
    }

    getPlaylist() {
        return this.playlist
    }

    setState(stateValue) {
        this.state = stateValue
    }


    setVolume(volume) {
        this.volume = volume;
    }

    getState() {
        return this.state
    }
}

const player = new Player()

listener.register('playerstate_volume', EVENTS.PLAYER_VOLUME, () => player.setVolume(document.getElementById('casper_video').volume))
listener.register('playerstate_start', EVENTS.PLAYER_START, () => player.setState(STATE.PLAYING))
listener.register('playerstate_pause', EVENTS.PLAYER_PAUSE, () => player.setState(STATE.PAUSE))
listener.register('playerstate_stop', EVENTS.PLAYER_STOP, () => player.setState(STATE.STOP))
listener.register('playerstate_playlist_change', EVENTS.PLAYLIST_CHANGE, (playlist) => player.setPlaylist(playlist))
listener.register('playerstate_playlist_index', EVENTS.PLAYLIST_INDEX, (index) => player.setPlaylistIndex(index))

export default player