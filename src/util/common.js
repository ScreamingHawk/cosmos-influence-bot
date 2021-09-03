const influenceApi = require('./influenceApi')
const openseaApi = require('./openseaApi')

const getRoidLinks = (id, owned) => {
	let link = `[Influence](${influenceApi.getAsteroidUrl(id)})`
	if (owned) {
		link += ` | [OpenSea](${openseaApi.getAsteroidUrl(id)})`
	}
	link += ` | [adalia.info](https://adalia.info/asteroids/${id})`
	return link
}

module.exports = {
	getRoidLinks,
}
