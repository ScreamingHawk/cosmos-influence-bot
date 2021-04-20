const test = require('ava')
const database = require('./database')

test.before(() => {
	database.initDatabase()
})

test('address table works', t => {
	// Set up
	const address = 'abc123'
	const discordId = 'xyz789'

	// Test
	database.setAddress(discordId, address)

	// Validate
	let actual = database.getAddress(discordId)
	t.is(address, actual)

	//TODO Clean Up
})

test('channel events table works', t => {
	// Set up
	const channel = '123'
	const events = {
		channel,
		Transfer: 1,
		AsteroidScanned: 0,
	}

	// Test
	database.setChannelEvents(events)

	// Validate
	let actual = database.getChannelEvents(channel)
	t.deepEqual(events, actual)
	actual = database.listEventChannels('Transfer')
	t.is(1, actual.length)
	t.deepEqual(channel, actual[0].channel)
	actual = database.listEventChannels('AsteroidScanned')
	t.is(0, actual.length)

	// Clean Up
	database.removeChannelEvents(channel)
	actual = database.listEventChannels('Transfer')
	t.is(0, actual.length)
})
