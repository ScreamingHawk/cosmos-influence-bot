const ethers = require('ethers')
const influence = require('influence-utils')
const { listEventChannels } = require('../db/database')
const contractUtil = require('../util/contractUtil')
const { getMemberOrAddress } = require('../util/discordUtil')
const log = require('../util/logger')

let bot

const initListeners = async botArg => {
	bot = botArg

	// Transfer event Asteroid
	const asteroidToken = contractUtil.getContract('AsteroidToken')
	asteroidToken.on('Transfer', (from, to, tokenId) => {
		log.debug('Asteroid transfer event!')
		if (from === ethers.constants.AddressZero) {
			const msg = `Asteroid #${tokenId} was purchased by`
			log.info(msg + to)
			sendToEventChannels(bot, 'Transfer', msg, to)
		}
	})
	// Transfer event Crew
	const crewToken = contractUtil.getContract('CrewToken')
	crewToken.on('Transfer', (from, to, tokenId) => {
		log.debug('Crew transfer event!')
		if (from === ethers.constants.AddressZero) {
			const msg = `Crew #${tokenId} was purchased by`
			log.info(msg + to)
			sendToEventChannels(bot, 'Transfer', msg, to)
		}
	})

	// Asteroid Scanned event
	const asteroidScans = contractUtil.getContract('AsteroidScans')
	asteroidScans.on('AsteroidScanned', async (...args) => {
		log.debug(`AsteroidScanned (${args.join(', ')})`)
		const msg = await getAsteroidScannedMessage(...args)
		sendToEventChannels(bot, 'AsteroidScanned', msg)
	})

	log.info('Listening for events')
}

const sendToEventChannels = async (bot, event, message, address) => {
	const channels = listEventChannels(event).map(events => events.channel)
	for (let c of channels) {
		const chan = bot.channels.cache.get(c)
		const tag = await getMemberOrAddress(chan.guild, address)
		chan.send(`${message} ${tag}`)
	}
}

const getAsteroidScannedMessage = async (asteroidId, bonuses) => {
	let msg = `Asteroid #${asteroidId} was scanned`
	try {
		// Get the rarity
		const asteroidFeatures = contractUtil.getContract('AsteroidFeatures')
		const spectral = parseInt(
			await asteroidFeatures.getSpectralType(asteroidId),
		)
		const rarity = influence.toRarity(influence.toBonuses(bonuses, spectral))
		msg += ` and is \`${rarity}\``
	} catch (err) {
		log.sendErr(bot, `Error getting spectral type: ${err.message}`)
	}

	log.info(msg)
	return msg
}

module.exports = {
	initListeners,
	// Exported for testing
	getAsteroidScannedMessage,
}
