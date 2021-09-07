require('dotenv').config()
const fetch = require('node-fetch')
const influenceUtils = require('influence-utils')
const log = require('../util/logger')

const INFLUENCE_API = 'https://api.influenceth.io'
const INFLUENCE_URL = 'https://game.influenceth.io'

const { INFLUENCE_API_KEY, INFLUENCE_API_SECRET } = process.env

let accessToken

const initInfluenceApi = async bot => {
	if (!INFLUENCE_API_KEY || !INFLUENCE_API_SECRET) {
		log.sendErr(bot, 'No influence credentials')
		return
	}
	const res = await fetch(`${INFLUENCE_API}/v1/auth/token`, {
		method: 'post',
		body: JSON.stringify({
			grant_type: 'client_credentials',
			client_id: INFLUENCE_API_KEY,
			client_secret: INFLUENCE_API_SECRET,
		}),
		headers: { 'Content-Type': 'application/json' },
	})
	const token = await res.json()
	accessToken = token.access_token
}

const sendReq = async api => {
	if (!accessToken) {
		return null
	}
	log.debug(`Requesting ${api}`)
	const res = await fetch(api, {
		method: 'get',
		headers: { Authorization: `Bearer ${accessToken}` },
	})
	return await res.json()
}

const getAsteroidUrl = id => `${INFLUENCE_URL}/${id}`

const getAsteroid = async id => {
	const api = `${INFLUENCE_API}/v1/asteroids/${id}`
	return await sendReq(api)
}

// These should be in the influence utils
const toSize = rad => {
	if (rad <= 5000) {
		return 'Small'
	}
	if (rad <= 20000) {
		return 'Medium'
	}
	if (rad <= 50000) {
		return 'Large'
	}
	return 'Huge'
}
const toDegrees = rad => (rad * 180) / Math.PI

const addDescription = asteroid => {
	const size = toSize(asteroid.radius).toLowerCase()
	const scanned = asteroid.scanned
		? influenceUtils
			.toRarity(
				influenceUtils.toBonuses(asteroid.rawBonuses, asteroid.spectralType),
			)
			.toLowerCase()
		: 'unscanned'
	const spectral = influenceUtils.toSpectralType(asteroid.spectralType)
	asteroid.description = `A ${size}, ${scanned}, ${spectral}-type asteroid`
}

const addOrbit = asteroid => {
	const orbital = new influenceUtils.KeplerianOrbit(asteroid.orbital)
	asteroid.period = orbital.getPeriod()
	asteroid.inclination = toDegrees(orbital.i)
}

module.exports = {
	initInfluenceApi,
	getAsteroidUrl,
	getAsteroid,
	addDescription,
	addOrbit,
}
