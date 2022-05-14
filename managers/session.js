
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const listener = require('./../utils/listener');

class SessionManager {
    #store;

    init(app) {
        this.#store = new MemoryStore({
            checkPeriod: 86400000
        })

        app.use(session({
            store: this.#store,
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }))
    }

    removeSessionFromUserId(userId) {
        this.#store.all((error, sessions) => {
            if (error) {
                console.log(error)
            }
            Object.keys(sessions).forEach(sessionId => {
                const sessionData = sessions[sessionId];
                console.log(sessionData)

                if (sessionData.user?.id === userId) {
                    console.log('destroy ' + sessionId)
                    this.#store.destroy(sessionId)
                }
            })

            console.log('USERID ', userId)
        })
    }
}

const sessionManager = new SessionManager()

listener.listen('USER_DELETE', userId => sessionManager.removeSessionFromUserId(userId));

module.exports = sessionManager