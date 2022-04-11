export const EVENTS = {
    PLAYER_START: 'playerstart',
    PLAYER_STOP: 'playerstop',
    PLAYER_PAUSE: 'playerpause',
    PLAYER_END: 'playerend',
    PLAYER_TIME_UPDATE: 'playertimeupdate',
    PLAYER_META: 'playermeta',
    PLAYER_SEEK: 'playerseek',
    PLAYER_CURRENT_HUMAN: 'playercurrenthuman',
    ACTION_PLAY_SONG: 'action_play_song',
    PLAYLIST_CHANGE: 'playlist_change',
    PLAYLIST_INDEX: 'playlist_index'
}

class Listener {
    uuids = []
    events={
        [EVENTS.PLAYER_START]: [],
        [EVENTS.PLAYER_STOP]: [],
        [EVENTS.PLAYER_PAUSE]: [],
        [EVENTS.PLAYER_END]: [],
        [EVENTS.PLAYER_TIME_UPDATE]: [],
        [EVENTS.PLAYER_META]: [],
        [EVENTS.PLAYER_CURRENT_HUMAN]: [],
        [EVENTS.PLAYER_SEEK]: [],
        [EVENTS.ACTION_PLAY_SONG]: [],
        [EVENTS.PLAYLIST_CHANGE]: [],
        [EVENTS.PLAYLIST_INDEX]: [],
    }

    register(uuid, eventName, callback) {
        if (this.events[eventName] === undefined || this.uuids.indexOf(uuid) !== -1) {
            return
        }
        this.uuids.push(uuid);
        this.events[eventName].push(callback)
    }

    dispatch(eventName, ...args){
        Object.values(this.events[eventName] || {}).forEach(event => event(...args))
    }
}

const listener = new Listener()

export default listener