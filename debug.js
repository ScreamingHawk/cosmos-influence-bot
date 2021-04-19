/* eslint-disable no-unused-vars */
require('dotenv').config()
const log = require('./src/util/logger')
const Discord = require('discord.js')
const database = require('./src/db/database')

database.initDatabase()

const TOKEN = process.env.DISCORD_TOKEN
const bot = new Discord.Client()
let g

bot.on('ready', () => {
	log.info('Discord login successful!')
	g = bot.guilds.cache.first()
})
bot.login(TOKEN)
