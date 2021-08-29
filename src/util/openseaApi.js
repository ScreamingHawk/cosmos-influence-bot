const fetch = require('node-fetch')
const { addresses } = require('./contractUtil')
const log = require('./logger')

const OPENSEA_URL = 'https://opensea.io/assets'
const OPENSEA_API = 'https://api.opensea.io/api/v1'

const API_LIMIT = 5 // Number of response to return

const getAsteroidUrl = id =>
	`${OPENSEA_URL}/${addresses['AsteroidToken']}/${id}`

const getAsteroid = async id => {
	const api = `${OPENSEA_API}/asset/${addresses['AsteroidToken']}/${id}`
	log.debug(`Requesting ${api}`)
	const res = await fetch(api)
	return await res.json()
}

const getUserAsteroids = async (address, page = 1) => {
	const offset = API_LIMIT * (page - 1)
	const api = `${OPENSEA_API}/assets?asset_contract_address=${addresses['AsteroidToken']}&owner=${address}&offset=${offset}&limit=${API_LIMIT}&order_by=pk&order_direction=asc`
	log.debug(`Requesting ${api}`)
	const res = await fetch(api)
	return await res.json()
}

module.exports = {
	getAsteroidUrl,
	getAsteroid,
	getUserAsteroids,
	API_LIMIT,
}
