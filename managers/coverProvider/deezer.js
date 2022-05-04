const AbstractCoverProvider = require("./abstractProvider");

class DeezerProvider extends AbstractCoverProvider {
    url = `https://api.deezer.com/search?q=__QUERY__`

    async performResponse(data) {
        return [...(new Set( data.data.map(result => result.album?.cover_medium || null).filter(i => i !== null)))];
    }
}

const deezerProvider = new DeezerProvider()

module.exports = deezerProvider;