const { getDiscordId } = require('../db/database')
const log = require('./logger')

const checkAdmin = (message, alert = true) => {
	if (!message.guild) {
		// DM. Assume admin
		return true
	}
	//FIXME This is bug testing code
	if (message.member === null) {
		log.error(
			'For some reason the message has no member... Need to investigate',
		)
		try {
			log.error(JSON.stringify(message, null, 2))
		} catch (err) {
			log.error('Unable to stringify message', err)
		}
		return false
	}
	// Check admin status
	if (!message.member.hasPermission('ADMINISTRATOR')) {
		if (alert) {
			message.reply('only administators can do this')
		}
		return false
	}
	return true
}

const getMemberOrAddress = async (guild, address) => {
	if (!address) {
		return null
	}
	const discordId = getDiscordId(address)
	if (discordId) {
		try {
			const member = await guild.members.fetch(discordId)
			if (member) {
				return member
			}
		} catch (err) {
			// Fail out
		}
	}
	return '`' + address + '`'
}

module.exports = {
	checkAdmin,
	getMemberOrAddress,
}
