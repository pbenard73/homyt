const path = require('path')
const fs = require('fs')

const BASE_RADIO = path.resolve(__dirname, '../data/base_radio.json')
const CUSTOM_RADIO = path.resolve(__dirname, '../data/radio.json')
const BASE_SERVER = path.resolve(__dirname, '../data/base_server.json')
const CUSTOM_SERVER = path.resolve(__dirname, '../data/server.json')

class DataManager {
    checkPresence() {
        if (fs.existsSync(CUSTOM_RADIO) === false) {
            fs.copyFileSync(BASE_RADIO, CUSTOM_RADIO);
        }
        if (fs.existsSync(CUSTOM_SERVER) === false) {
            fs.copyFileSync(BASE_SERVER, CUSTOM_SERVER);
        }
    }
}

const dataManager = new DataManager()

module.exports = dataManager;