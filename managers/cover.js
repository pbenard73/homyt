const deezerProvider = require("./coverProvider/deezer");

class CoverManager {
    search(query) {
        return deezerProvider.search(query)
    }
}

const coverManager = new CoverManager()

module.exports = coverManager;