const log = require('./logger')

const checkAdmin = (message, alert = true) => {
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
