const Discord = require('discord.js')
const ethers = require('ethers')
const log = require('../util/logger')
const influenceApi = require('../util/influenceApi')
const openseaApi = require('../util/openseaApi')

let bot, provider

const initAsteroids = (botArg, projectId, projectSecret) => {
	bot = botArg
	provider = ethers.getDefaultProvider('homestead', {
		infura: {
			projectId,
			projectSecret,
		},
	})
	provider.ready.then(() => {
		log.info('Infura provider is ready')
	})
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
		roid = await openseaApi.getAsteroid(id)
	} catch (err) {
		log.error(errorMsg, err)
		return message.reply(errorMsg)
	}
	if (!roid) {
		return message.reply(errorMsg)
	}
	// Parse for display
	const embed = new Discord.MessageEmbed()
		.setTitle(`${roid.name} #${roid.token_id}`)
		.setColor(0xd82929)

	roid.traits.map(t => embed.addFields({ name: t.trait_type, value: t.value }))
	embed.addFields({ name: 'Influence', value: influenceApi.getAsteroidUrl(id) })
	embed.addFields({ name: 'OpenSea', value: openseaApi.getAsteroidUrl(id) })
	embed.setImage(roid.image_url)
	embed.setFooter('Data provided by OpenSea', bot.user.displayAvatarURL())

	return message.channel.send({ embed })
}

module.exports = {
	initAsteroids,
	showAsteroidDetails,
}
