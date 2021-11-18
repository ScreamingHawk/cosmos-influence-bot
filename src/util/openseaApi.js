const fetch = require('node-fetch')
const { addresses } = require('./contractUtil')
const log = require('./logger')
const { OPENSEA_ROID_SLUG, OPENSEA_CREW_SLUG } = require('./constants')

const OPENSEA_URL = 'https://opensea.io/assets'
const OPENSEA_API = 'https://api.opensea.io/api/v1'

const API_LIMIT = 5 // Number of response to return

const { OPENSEA_API_KEY } = process.env
const headers = OPENSEA_API_KEY ? { 'X-API-KEY': OPENSEA_API_KEY } : {}

const makeRequest = async api => {
	log.debug(`Requesting ${api}`)
	const res = await fetch(api, { method: 'GET', headers })
	if (!res.ok) {
		log.error(`Opensea status code: ${res.status}`)
	}
	return await res.json()
}

const getAsteroidUrl = id =>
	`${OPENSEA_URL}/${addresses['AsteroidToken']}/${id}`

const getCrewUrl = id => `${OPENSEA_URL}/${addresses['CrewToken']}/${id}`

const getAsteroid = async id => {
	const api = `${OPENSEA_API}/asset/${addresses['AsteroidToken']}/${id}`
	return await makeRequest(api)
}

const getUserAsteroids = async (address, page = 1) => {
	const offset = API_LIMIT * (page - 1)
	const api = `${OPENSEA_API}/assets?asset_contract_address=${addresses['AsteroidToken']}&owner=${address}&offset=${offset}&limit=${API_LIMIT}&order_by=pk&order_direction=asc`
	return await makeRequest(api)
}

const getSaleEvents = async (slug, after) => {
	let api = `${OPENSEA_API}/events?collection_slug=${slug}&event_type=successful&limit=${API_LIMIT}`
	if (after) {
		// Add unix timestamp
		api += `&occurred_after=${after.unix()}`
	}
	return await makeRequest(api)
}

const getAsteroidSaleEvents = async after => {
	return await getSaleEvents(OPENSEA_ROID_SLUG, after)
}

const getCrewSaleEvents = async after => {
	return await getSaleEvents(OPENSEA_CREW_SLUG, after)
}

module.exports = {
	getAsteroidUrl,
	getCrewUrl,
	getAsteroid,
	getUserAsteroids,
	getAsteroidSaleEvents,
	getCrewSaleEvents,
	API_LIMIT,
}
