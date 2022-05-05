const deezerProvider = require("./coverProvider/deezer");

class CoverManager {
    search(query, isRadio) {
        return deezerProvider.search(query, isRadio)
    }
}

const coverManager = new CoverManager()

module.exports = coverManager;