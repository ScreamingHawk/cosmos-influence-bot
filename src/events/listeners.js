const ethers = require('ethers')
const { listEventChannels, getDiscordId } = require('../db/database')
const { getContract } = require('../util/contracts')
const log = require('../util/logger')

const sendToEventChannels = async (bot, event, message, address) => {
	const channels = listEventChannels(event).map(events => events.channel)
	const discordId = address ? getDiscordId(address) : null
	for (let c of channels) {
		const chan = bot.channels.cache.get(c)
		if (discordId) {
			// Check the user is in this guild
			const member = await chan.guild.members.fetch(discordId)
			if (member) {
				chan.send(`${message} ${member}`)
				continue
			}
		}
		chan.send(`${message} ${address || ''}`)
	}
}

const initListeners = async (bot, provider) => {
	// Transfer event
	const asteroidToken = getContract('AsteroidToken', provider)
	asteroidToken.on('Transfer', (from, to, tokenId) => {
		log.debug('Transfer event!')
		if (from === ethers.constants.AddressZero) {
			const msg = `Asteroid #${tokenId} was purchased by`
			log.info(msg + to)
			sendToEventChannels(bot, 'Transfer', msg, to)
		}
	})

	// Asteroid Scanned event
	const asteroidScans = getContract('AsteroidScans', provider)
	//eslint-disable-next-line no-unused-vars
	asteroidScans.on('AsteroidScanned', (asteroidId, bonuses) => {
		log.debug('AsteroidScanned event!')
		//TODO Get the rarity
		const msg = `Asteroid #${asteroidId} was scanned`
		log.info(msg)
		sendToEventChannels(bot, 'AsteroidScanned', msg)
	})

	log.info('Listening for events')
}

module.exports = {
	initListeners,
}
