const log = require('../util/logger')
const { getAddress, getDiscordId } = require('../db/database')

let bot

const initInfo = botArg => {
	bot = botArg
}

// Output user's address
const showAddress = async message => {
	const user = message.mentions.users.first() || message.author
	const address = getAddress(user.id)
	if (!address) {
		return message.reply(`${user.username} hasn't verified their address`)
	}
	return message.reply(`${user.username}'s address is ${address}`)
}

// Output address's user
const showUser = async (message, args) => {
	if (!args) {
		return message.reply('please supply an address to check')
	}
	const address = args[0]
	const id = getDiscordId(address)
	if (!id) {
		log.info('No DB record')
		return message.reply(`no user linked to address ${address}`)
	}
	let user
	try {
		user = await bot.users.fetch(id)
	} catch (err) {
		log.error('Unable to get user by id', err)
		return message.reply(`no user linked to address ${address}`)
	}
	if (!user) {
		log.info('No user in discord')
		return message.reply(`no user linked to address ${address}`)
	}
	return message.reply(`${address} to linked to ${user.username}`)
}

module.exports = {
	initInfo,
	showAddress,
	showUser,
}
