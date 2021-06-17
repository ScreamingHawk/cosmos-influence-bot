const ava = require('ava')
const test = ava.serial
const fs = require('fs')
const events = require('./events')
const database = require('../db/database')
const log = require('../util/logger')

const testDb = 'database.testevents.sqlite'

test.beforeEach(() => {
	if (fs.existsSync(testDb)) {
		// Delete old DB
		log.debug('Deleting old DB')
		fs.unlinkSync(testDb)
	}
	database.initDatabase(testDb)
})

test.afterEach(database.closeDatabase)

const createMockMessage = channel => {
	return {
		channel: {
			id: channel,
		},
		reply: () => {},
	}
}

test('can toggle event', t => {
	// Set up
	const eventName = 'Transfer'
	const mockMessage = createMockMessage('555')

	// Test on
	events.toggleEvent(mockMessage, [eventName])

	// Validate on
	let actual = database.getChannelEvents(mockMessage.channel.id)
	t.deepEqual(
		{
			channel: mockMessage.channel.id,
			Transfer: 1,
			AsteroidScanned: 0,
		},
		actual,
	)

	// Test off
	events.toggleEvent(mockMessage, [eventName])

	// Validate off
	actual = database.getChannelEvents(mockMessage.channel.id)
	t.deepEqual(
		{
			channel: mockMessage.channel.id,
			Transfer: 0,
			AsteroidScanned: 0,
		},
		actual,
	)
})

test('can allow multiple channels', t => {
	// Set up
	const eventName = 'Transfer'
	const msg1 = createMockMessage('1')
	const msg2 = createMockMessage('2')

	// Initial state validation
	let actual = database.listEventChannels(eventName)
	t.is(0, actual.length)

	// Test
	events.toggleEvent(msg1, [eventName])
	events.toggleEvent(msg2, [eventName])

	// Validate
	actual = database.listEventChannels(eventName)
	t.is(2, actual.length)
})
