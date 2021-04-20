const fetch = require('node-fetch')
const { addresses } = require('./contracts')
const log = require('./logger')

const OPENSEA_URL = 'https://opensea.io/assets'
const OPENSEA_API = 'https://api.opensea.io/api/v1/asset'

const getAsteroidUrl = id =>
	`${OPENSEA_URL}/${addresses['AsteroidToken']}/${id}`

const getAsteroid = async id => {
	const api = `${OPENSEA_API}/${addresses['AsteroidToken']}/${id}`
	log.debug(`Requesting ${api}`)
	const res = await fetch(api)
	return await res.json()
}

module.exports = {
	getAsteroidUrl,
	getAsteroid,
}
