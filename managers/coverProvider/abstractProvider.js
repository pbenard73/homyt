const axios = require('axios')

class AbstractCoverProvider {
    url=null;

    generateUrl(album) {
        return this.url.replace('__QUERY__', album);
    }

    async performResponse(data) {
        return data
    }

    async search(album, isRadio) {
        const {data} = await axios.get(this.generateUrl(album))
        const finalData = await this.performResponse(data, isRadio)

        return finalData
    }
}

module.exports = AbstractCoverProvider;