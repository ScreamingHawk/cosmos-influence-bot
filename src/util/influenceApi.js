const fetch = require('node-fetch')
const log = require('../util/logger')

const INFLUENCE_API = 'https://api.influenceth.io'
const INFLUENCE_URL = 'https://game.influenceth.io'

const getAsteroidUrl = id => `${INFLUENCE_URL}/${id}`

const getAsteroid = async id => {
	const api = `${INFLUENCE_API}/metadata/asteroids/${id}`
	log.debug(`Requesting ${api}`)
	const res = await fetch(api)
	return await res.json()
}

module.exports = {
	getAsteroidUrl,
	getAsteroid,
}
