const log = require('../util/logger')
const database = require('../db/database')

// List events configured for the current channel
const listEvents = message => {
	const events = database.getChannelEvents(message.channel.id)
	let msg = Object.entries(events)
		// Filter channel itself
		.filter(e => e[0] !== 'channel')
		.map(e => `${e[1] ? '✅' : '❎'} ${e[0]}`)
		.join('\n')
	return message.reply(
		`this channel is listening to the following events:\n${msg}`,
	)
}

const toggleEvent = (message, args) => {
	// Validate input
	if (!args.length) {
		return message.reply('please supply an event to toggle')
	}
	log.debug(`Toggling ${args[0]} event in ${message.channel.id}`)
	const events = database.getChannelEvents(message.channel.id)
	const event = Object.keys(events)
		.filter(e => e[0] !== 'channel')
		.find(k => k.toLowerCase() === args[0].toLowerCase())
	if (!event) {
		return message.reply('please supply an valid event to toggle')
	}

	log.info(`Toggle event ${event} in ${message.channel.id}`)

	events[event] = events[event] ? 0 : 1
	database.setChannelEvents(events)
	return listEvents(message)
}

module.exports = {
	listEvents,
	toggleEvent,
}
