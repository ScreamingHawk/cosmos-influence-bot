const Discord = require('discord.js')
const { getAddress } = require('../db/database')
const log = require('../util/logger')
const influenceApi = require('../util/influenceApi')
const openseaApi = require('../util/openseaApi')

let bot, provider

const initAsteroids = (botArg, providerArg) => {
	bot = botArg
	//eslint-disable-next-line no-unused-vars
	provider = providerArg
}

// Output asteroid details
const showAsteroidDetails = async (message, args) => {
	if (!args) {
		return message.reply('please supply an asteroid id to check')
	}
	const id = args[0]
	let roid
	const errorMsg = `unable to get details for asteroid #${id}`
	try {
		roid = await influenceApi.getAsteroid(id)
	} catch (err) {
		log.error(errorMsg, err)
		return message.reply(errorMsg)
	}
	if (!roid) {
		return message.reply(errorMsg)
	}

	// Parse for display
	const embed = new Discord.MessageEmbed()
		.setTitle(`${roid.name} #${id}`)
		.setColor(0x1890dc)

	embed.addFields({ name: 'Description', value: roid.description })
	roid.attributes.map(t =>
		embed.addFields({ name: t.trait_type, value: t.value }),
	)
	embed.addFields({ name: 'Influence', value: influenceApi.getAsteroidUrl(id) })
	embed.addFields({ name: 'OpenSea', value: openseaApi.getAsteroidUrl(id) })
	embed.setFooter('Data provided by Influence', bot.user.displayAvatarURL())

	return message.channel.send({ embed })
}

const showUserAsteroids = async message => {
	const user = message.mentions.users.first() || message.author
	const address = getAddress(user.id)

	if (!address) {
		return message.reply(`${user.username} has not verified their address`)
	}

	let roids
	const errorMsg = `unable to get details ${user.username}'s asteroids`
	try {
		roids = await openseaApi.getUserAsteroids(address)
	} catch (err) {
		log.error(errorMsg, err)
		return message.reply(errorMsg)
	}
	if (!roids) {
		return message.reply(errorMsg)
	}

	if (!roids.assets) {
		return message.reply(`${user.username} does not have any asteroids`)
	}

	// Parse for display
	const embed = new Discord.MessageEmbed()
		.setTitle(`${user.username}'s Asteroids`)
		.setColor(0x1890dc)

	roids.assets.map(a =>
		embed.addFields({
			name: `${a.name} #${a.token_id}`,
			value: influenceApi.getAsteroidUrl(a.token_id),
		}),
	)
	embed.setFooter('Data provided by OpenSea', bot.user.displayAvatarURL())

	return message.channel.send({ embed })
}

module.exports = {
	initAsteroids,
	showAsteroidDetails,
	showUserAsteroids,
}