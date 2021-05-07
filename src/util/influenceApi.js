const fetch = require('node-fetch')
const influenceUtils = require('influence-utils')
const log = require('../util/logger')

const INFLUENCE_API = 'https://api.influenceth.io'
const INFLUENCE_URL = 'https://game.influenceth.io'

let apiKey

const initInfluenceApi = apiKeyArg => {
	apiKey = apiKeyArg
}

const getAsteroidUrl = id => `${INFLUENCE_URL}/${id}`

const getAsteroid = async id => {
	const api = `${INFLUENCE_API}/asteroids/${id}?api-key=${apiKey}`
	log.debug(`Requesting ${api}`)
	const res = await fetch(api)
	return await res.json()
}

// These should be in the influence utils
const toSize = rad => {
	if (rad <= 5000) {return 'Small'}
	if (rad <= 20000) {return 'Medium'}
	if (rad <= 50000) {return 'Large'}
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
