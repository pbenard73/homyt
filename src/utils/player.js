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

    getContext() {
        if (this.context === null) {
            const audioElement = document.querySelector('#casper_video')
            const canvas = document.querySelector('#spectrum_canvas')

            var audioContext = new (window.AudioContext || window.webkitAudioContext)();
            var analyzer = audioContext.createAnalyser();
            let gainNode = audioContext.createGain();
            
            var source = audioContext.createMediaElementSource(audioElement);
            source.connect(gainNode );
            source.connect(analyzer  );

            gainNode.connect(audioContext.destination);

            this.context = {
                audioContext, gainNode, analyzer, canvas
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

    getState() {
        return this.state
    }
}

const player = new Player()

listener.register('playerstate_start', EVENTS.PLAYER_START, () => player.setState(STATE.PLAYING))
listener.register('playerstate_pause', EVENTS.PLAYER_PAUSE, () => player.setState(STATE.PAUSE))
listener.register('playerstate_stop', EVENTS.PLAYER_STOP, () => player.setState(STATE.STOP))
listener.register('playerstate_playlist_change', EVENTS.PLAYLIST_CHANGE, (playlist) => player.setPlaylist(playlist))
listener.register('playerstate_playlist_index', EVENTS.PLAYLIST_INDEX, (index) => player.setPlaylistIndex(index))

export default player