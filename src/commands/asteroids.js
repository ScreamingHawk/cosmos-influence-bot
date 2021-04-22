const Discord = require('discord.js')
const ethers = require('ethers')
const database = require('../db/database')
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
	if (!args.length) {
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

	embed.addField('Description', roid.description, true)
	roid.attributes.map(t => embed.addField(t.trait_type, t.value, true))
	embed.addField('Influence', influenceApi.getAsteroidUrl(id), true)
	embed.addField('OpenSea', openseaApi.getAsteroidUrl(id), true)
	embed.setFooter('Data provided by Influence', bot.user.displayAvatarURL())

	return message.channel.send({ embed })
}

const showUserAsteroids = async (message, args) => {
	let who
	let user = message.mentions.users.first()
	let address
	if (user) {
		// Tag
		who = user.username
		address = database.getAddress(user.id)
	} else if (args.length) {
		// Address arg
		who = args[0]
		address = who
		if (!ethers.utils.isAddress(address)) {
			return message.reply(`${who} is not a valid address`)
		}
	} else {
		// Self
		who = message.author.username
		address = database.getAddress(message.author.id)
	}

	if (!address) {
		return message.reply(`${who} has not verified their address`)
	}

	let roids
	const errorMsg = `unable to get details ${who}'s asteroids`
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
		return message.reply(`${who} does not have any asteroids`)
	}

	// Parse for display
	const embed = new Discord.MessageEmbed()
		.setTitle(`${who}'s Asteroids`)
		.setColor(0x1890dc)

	roids.assets.map(a =>
		embed.addField(
			`${a.name} #${a.token_id}`,
			influenceApi.getAsteroidUrl(a.token_id),
		),
	)
	embed.setFooter('Data provided by OpenSea', bot.user.displayAvatarURL())

	return message.channel.send({ embed })
}

module.exports = {
	initAsteroids,
	showAsteroidDetails,
	showUserAsteroids,
}
