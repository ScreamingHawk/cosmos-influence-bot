const fetch = require('node-fetch')
const { addresses } = require('./contracts')
const log = require('./logger')

const OPENSEA_URL = 'https://opensea.io/assets'
const OPENSEA_API = 'https://api.opensea.io/api/v1'

const getAsteroidUrl = id =>
	`${OPENSEA_URL}/${addresses['AsteroidToken']}/${id}`

const getAsteroid = async id => {
	const api = `${OPENSEA_API}/asset/${addresses['AsteroidToken']}/${id}`
	log.debug(`Requesting ${api}`)
	const res = await fetch(api)
	return await res.json()
}

const getUserAsteroids = async address => {
	const api = `${OPENSEA_API}/assets?owner=${address}&asset_contract_address=${addresses['AsteroidToken']}`
	log.debug(`Requesting ${api}`)
	const res = await fetch(api)
	return await res.json()
}

module.exports = {
	getAsteroidUrl,
	getAsteroid,
	getUserAsteroids,
}
