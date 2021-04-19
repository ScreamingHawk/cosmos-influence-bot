require('dotenv').config()
const log = require('./util/logger')
const Discord = require('discord.js')
const { initDatabase } = require('./db/database')
const help = require('./commands/help')

// Get token
const TOKEN = process.env.DISCORD_TOKEN
if (!TOKEN) {
	for (let i = 0; i < 5; i++) {
		log.error('NO DISCORD TOKEN!!!')
	}
	process.exit(1)
}

// Intialise database
initDatabase()

// Prepare env vars
const PREFIX = process.env.PREFIX || '#'
log.info(`Prefix is ${PREFIX}`)
const TEST_USER = process.env.TEST_USER || null
if (TEST_USER) {
	log.warn(`Running with access only for ${TEST_USER}`)
}

// Spin up bot
const bot = new Discord.Client()
bot.on('ready', () => {
	log.info('Discord login successful!')
	// Initialise commands
	help.initHelp(bot, PREFIX)
	log.info('Commands initialised')
})

bot.on('message', message => {
	// Ignore bots
	if (message.author.bot) {
		return
	}
	// Ignore DMs
	if (!message.guild) {
		return
	}

	// Check for bot command
	if (message.content.indexOf(PREFIX) !== 0) {
		return
	}

	// Get args for handling bot command
	const args = message.content.slice(PREFIX.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()

	// Ignore if running in test user mode and isn't test user
	if (TEST_USER && message.author.username !== TEST_USER) {
		return
	}

	if (command === 'help') {
		return help.showHelp(message, args)
	}
	if (command === 'about') {
		// Alias for 'help about'
		return help.showHelp(message, ['about'])
	}
	if (command === 'ping') {
		log.info('ping')
		return message.reply('pong')
	}
})

bot.login(TOKEN)
