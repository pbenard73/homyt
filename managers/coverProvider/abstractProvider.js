const axios = require('axios')

class AbstractCoverProvider {
    url=null;

    generateUrl(album) {
        return this.url.replace('__QUERY__', album);
    }

    async performResponse(data) {
        return data
    }

    async search(album) {
        const {data} = await axios.get(this.generateUrl(album))
        const finalData = await this.performResponse(data)

        return finalData
    }
}

module.exports = AbstractCoverProvider;