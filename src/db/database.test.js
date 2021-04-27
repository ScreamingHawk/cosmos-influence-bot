const ava = require('ava')
const test = ava.serial
const fs = require('fs')
const database = require('./database')
const log = require('../util/logger')

const testDb = 'database.test.sqlite'

test.beforeEach(() => {
	if (fs.existsSync(testDb)) {
		// Delete old DB
		log.debug('Deleting old DB')
		fs.unlinkSync(testDb)
	}
	database.initDatabase(testDb)
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
})

test('multiple channel events', t => {
	// Set up
	const createEvents = c => {
		return {
			channel: c,
			Transfer: 1,
			AsteroidScanned: 0,
		}
	}
	const channel1 = '1231'
	const channel2 = '1232'

	database.setChannelEvents(createEvents(channel1))
	database.setChannelEvents(createEvents(channel2))

	// Test
	let actual = database.listEventChannels('Transfer')
	t.is(2, actual.length)

	// Clean Up
	database.removeChannelEvents(channel1)
	database.removeChannelEvents(channel2)
	actual = database.listEventChannels('Transfer')
	t.is(0, actual.length)
})
