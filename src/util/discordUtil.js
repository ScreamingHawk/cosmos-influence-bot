const checkAdmin = (message, alert = true) => {
	if (!message.guild) {
		// DM. Assume admin
		return true
	}
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
