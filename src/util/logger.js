require('dotenv').config()
const { transports, createLogger, format } = require('winston')

const { MAINTAINER_DISCORD } = process.env

const log = createLogger({
	level: 'debug',
	format: format.combine(
		format.timestamp(),
		format.printf(
			info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`,
		),
	),
	transports: [new transports.Console()],
})

module.exports = log

const sendToUser = async (bot, err) => {
	if (bot && MAINTAINER_DISCORD) {
		const user = await bot.users.fetch(MAINTAINER_DISCORD)
		if (user) {
			user.send(err)
		}
	}
}

module.exports.sendInfo = async (bot, err) => {
	log.info(err)
	await sendToUser(bot, err)
}

module.exports.sendErr = async (bot, err) => {
	log.error(err)
	await sendToUser(bot, err)
}
