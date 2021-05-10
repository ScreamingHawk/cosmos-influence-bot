require('dotenv').config()
const log = require('./util/logger')
const Discord = require('discord.js')
const ethers = require('ethers')
const { initDatabase } = require('./db/database')
const asteroids = require('./commands/asteroids')
const events = require('./commands/events')
const help = require('./commands/help')
const roles = require('./commands/roles')
const verify = require('./commands/verify')
const userInfo = require('./commands/userInfo')
const { initListeners } = require('./events/listeners')
const { initPresence } = require('./events/presence')
const { initContracts } = require('./util/contractUtil')
const { initInfluenceApi } = require('./util/influenceApi')

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
const {
	VERIFICATION_LINK,
	INFURA_PROJECT_ID,
	INFURA_PROJECT_SECRET,
	INFLUENCE_API_KEY,
} = process.env
if (!VERIFICATION_LINK) {
	log.error(
		'Running without verification link. Users will not be able to verify their address',
	)
}
if (!INFURA_PROJECT_ID || !INFURA_PROJECT_SECRET) {
	log.error(
		'Running without Infura API details. You will not be able to do anything on chain',
	)
}
if (!INFLUENCE_API_KEY) {
	log.error(
		'Running without Influence API key. You will not be able to get game state information',
	)
}

// Spin up bot
const bot = new Discord.Client()
const provider = new ethers.providers.InfuraProvider(
	'homestead',
	INFURA_PROJECT_ID,
)
provider.ready.then(() => {
	log.info('Infura provider is ready')
})
bot.on('ready', () => {
	log.info('Discord login successful!')

	// Initialise utils
	initContracts(provider)
	initInfluenceApi(INFLUENCE_API_KEY)
	// Initialise discord presence
	initPresence(bot)
	// Initialise listeners
	initListeners(bot)
	// Initialise commands
	help.initHelp(bot, PREFIX)
	verify.initVerify(VERIFICATION_LINK)
	userInfo.initUserInfo(bot)
	asteroids.initAsteroids(bot, provider)

	log.info('Cosmos initialised')
})

bot.on('message', message => {
	// Ignore bots
	if (message.author.bot) {
		return
	}

	// Slide into those DMs for verification
	if (!message.guild && verify.isPending(message)) {
		// Complete verification
		return verify.completeVerification(message, [message.content])
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
		return help.showAbout(message)
	}
	if (command === 'ping') {
		log.info('ping')
		return message.reply('pong')
	}
	// Verification commands
	if (command === 'verify') {
		return verify.prepareVerification(message, args)
	}
	// User Info commands
	if (command === 'address') {
		return userInfo.showAddress(message, args)
	}
	if (command === 'user') {
		return userInfo.showUser(message, args)
	}
	// Asteroid commands
	if (command === 'asteroid' || command === 'roid') {
		return asteroids.showAsteroidDetails(message, args)
	}
	if (command === 'owned' || command === 'owner') {
		return asteroids.showUserAsteroids(message, args)
	}
	// Event commands
	if (command === 'events') {
		return events.listEvents(message)
	}

	// Admin commands beyond this point
	if (
		(message.memeber !== null &&
			message.member.hasPermission('ADMINISTRATOR')) ||
		(TEST_USER && message.author.username === TEST_USER)
	) {
		// Event commands
		if (command === 'event') {
			return events.toggleEvent(message, args)
		}
		// Roles commands
		if (command === 'founder') {
			return roles.setFounderRole(message, args)
		}
	}
})

bot.login(TOKEN)
