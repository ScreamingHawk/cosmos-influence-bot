const Discord = require('discord.js')
const ethers = require('ethers')
const database = require('../db/database')
const log = require('../util/logger')
const contractUtil = require('../util/contractUtil')
const influenceApi = require('../util/influenceApi')
const openseaApi = require('../util/openseaApi')
const { formatNumber } = require('../util/format')
const help = require('./help')

let bot, provider

const initAsteroids = (botArg, providerArg) => {
	bot = botArg
	//eslint-disable-next-line no-unused-vars
	provider = providerArg
}

const getRoidLinks = id =>
	`[Influence](${influenceApi.getAsteroidUrl(
		id,
	)}) | [OpenSea](${openseaApi.getAsteroidUrl(id)})`

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
		.setTitle(`#${id} ${roid.name}`)
		.setColor(0x1890dc)

	influenceApi.addDescription(roid)
	influenceApi.addOrbit(roid)

	embed.addField('Description', roid.description, false)

	// Details
	embed.addField('Radius', `${formatNumber(roid.radius)}m`, true)
	embed.addField('Inclination', `${formatNumber(roid.inclination, 2)}˚`, true)
	embed.addField('Orbital', `${formatNumber(roid.period, 2)} days`, true)

	// Bonuses
	roid.bonuses.map(t =>
		embed.addField(t.name.replace(/\d/g, ''), `+${t.modifier}%`, true),
	)
	embed.addField('Links', `View on: ${getRoidLinks(id)}`, false)
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
		await message.reply(`${who} has not verified their address`)
		if (who === message.author.username) {
			return help.showHelp(message, ['verify'])
		}
		return
	}

	const pageNum = args.length > 1 ? args[1] : 1

	let roids, totalPages
	const errorMsg = `unable to get details ${who}'s asteroids`
	try {
		roids = await openseaApi.getUserAsteroids(address, pageNum)

		// Look up contract for total asteroid count
		const tokenContract = contractUtil.getContract('AsteroidToken')
		const total = await tokenContract.balanceOf(address)
		totalPages = Math.ceil(total / openseaApi.API_LIMIT)
	} catch (err) {
		log.error(errorMsg, err)
		return message.reply(errorMsg)
	}
	if (!roids) {
		return message.reply(errorMsg)
	}
	if (totalPages === 0) {
		return message.reply(`${who} does not have any asteroids`)
	}

	// Parse for display
	const embed = new Discord.MessageEmbed()
		.setTitle(`${who}'s Asteroids (page ${pageNum} of ${totalPages})`)
		.setColor(0x1890dc)

	if (!roids.assets || !roids.assets.length) {
		embed.setDescription('No asteroids')
	} else {
		roids.assets.map(a =>
			embed.addField(`${a.name} #${a.token_id}`, `${getRoidLinks(a.token_id)}`),
		)
	}

	embed.setFooter('Data provided by OpenSea', bot.user.displayAvatarURL())

	return message.channel.send({ embed })
}

module.exports = {
	initAsteroids,
	showAsteroidDetails,
	showUserAsteroids,
}
