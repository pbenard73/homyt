const path = require('path')
const fs = require('fs')

const BASE_RADIO = path.resolve(__dirname, '../data/base_radio.json')
const CUSTOM_RADIO = path.resolve(__dirname, '../data/radio.json')
const BASE_SERVER = path.resolve(__dirname, '../data/base_server.json')
const CUSTOM_SERVER = path.resolve(__dirname, '../data/server.json')
const MIGRATIONS_FOLDER = path.resolve(__dirname, '../migrations')
const UPLOADS_FOLDER = path.resolve(__dirname, '../uploads')
const UPLOADS_COVER_FOLDER = path.resolve(__dirname, '../uploads/cover')

class DataManager {
    checkPresence() {
        if (fs.existsSync(CUSTOM_RADIO) === false) {
            fs.copyFileSync(BASE_RADIO, CUSTOM_RADIO);
        }
        if (fs.existsSync(CUSTOM_SERVER) === false) {
            fs.copyFileSync(BASE_SERVER, CUSTOM_SERVER);
        }
        if (fs.existsSync(MIGRATIONS_FOLDER) === false) {
            fs.mkdirSync(MIGRATIONS_FOLDER);
        }
        if (fs.existsSync(UPLOADS_FOLDER) === false) {
            fs.mkdirSync(UPLOADS_FOLDER);
        }
        if (fs.existsSync(UPLOADS_COVER_FOLDER) === false) {
            fs.mkdirSync(UPLOADS_COVER_FOLDER);
        }
    }
}

const dataManager = new DataManager()

module.exports = dataManager;