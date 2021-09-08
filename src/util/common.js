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

const getCrewLinks = id => `[OpenSea](${openseaApi.getCrewUrl(id)})`

module.exports = {
	getRoidLinks,
	getCrewLinks,
}
