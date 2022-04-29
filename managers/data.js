const path = require('path')
const fs = require('fs')

const BASE_RADIO = path.resolve(__dirname, '../data/base_radio.json')
const CUSTOM_RADIO = path.resolve(__dirname, '../data/radio.json')
const CUSTOM_DATABASE = path.resolve(__dirname, '../database/db.sqlite')

class DataManager {
    checkPresence() {
        if (fs.existsSync(CUSTOM_RADIO) === false) {
            fs.copyFileSync(BASE_RADIO, CUSTOM_RADIO);
        }
    }
}

const dataManager = new DataManager()

module.exports = dataManager;