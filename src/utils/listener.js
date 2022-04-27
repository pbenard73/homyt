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
    PLAYLIST_INDEX: 'playlist_index',
    REMOTE_VOLUME: 'remote_volume',
    REMOTE_NEXT: 'remote_next',
    REMOTE_PREV: 'remote_prev',
    REMOTE_ACTION_VOLUME: 'remote_action_volume',
    REMOTE_ACTION_NEXT: 'remote_action_next',
    REMOTE_ACTION_PREV: 'remote_action_prev',
    MPD_STATUS: 'mpd_status',
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
        [EVENTS.REMOTE_VOLUME]: [],
        [EVENTS.REMOTE_VOLUME]: [],
        [EVENTS.REMOTE_VOLUME]: [],
        [EVENTS.REMOTE_ACTION_VOLUME]: [],
        [EVENTS.REMOTE_ACTION_NEXT]: [],
        [EVENTS.REMOTE_ACTION_PREV]: [],
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