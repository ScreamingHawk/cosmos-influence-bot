const ethers = require('ethers')
const { getContract } = require('../util/contracts')
const log = require('../util/logger')

const initEvents = async (bot, provider) => {
	// Transfer event
	const asteroidToken = getContract('AsteroidToken', provider)
	asteroidToken.on('Transfer', (from, to, tokenId) => {
		log.info('Transfer event!')
		if (from === ethers.constants.AddressZero) {
			log.info(`Asteroid #${tokenId} was purchased by ${to}`)
		}
	})

	const asteroidScans = getContract('AsteroidScans', provider)
	asteroidScans.on('AsteroidScanned', (asteroidId, bonuses) => {
		log.info('AsteroidScanned event!')
		log.info(asteroidId)
		log.info(bonuses)
	})

	log.info('Listening for events')
}

module.exports = {
	initEvents,
}
