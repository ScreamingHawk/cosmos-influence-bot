const log = require('./logger')

const checkAdmin = (message, alert = true) => {
	if (!message.guild) {
		// DM. Assume admin
		return true
	}
	//FIXME This is bug testing code
	if (!message.member) {
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

module.exports = {
	checkAdmin,
}
