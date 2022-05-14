class Listener {
    #pool = {}

    listen(eventName, callback) {
        const event = eventName.toUpperCase()

        if (this.#pool[event] === undefined) {
            this.#pool[event] = []
        }

        this.#pool[event].push(callback);
    }

    trigger(eventName, args) {
        const event = eventName.toUpperCase()

        if (this.#pool[event] === undefined) {
            return
        }

        this.#pool[event].forEach(callback => callback(args))
    }
}

const listener = new Listener()

module.exports = listener;