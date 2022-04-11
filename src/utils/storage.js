export const STORAGE = {
    VOLUME: 'volume',
}

class Storage {
    get(key) {
        return window.localStorage.getItem(key)
    }

    set(key, value){
        window.localStorage.setItem(key, value)
    }
}

const storage = new Storage()

export default storage