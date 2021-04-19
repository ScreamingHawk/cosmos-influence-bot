const { getAddress } = require('../db/database')

// Output user's address
const showAddress = async message => {
	// Validate inputs
	const user = message.mentions.users.first() || message.author
	const address = getAddress(user.id)
	if (!address) {
		return message.reply(`${user.username} hasn't verified their address`)
	}
	return message.reply(`${user.username}'s address is ${address}`)
}

module.exports = {
	showAddress,
}
