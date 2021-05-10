const ava = require('ava')
const test = ava.serial
const fs = require('fs')
const database = require('./database')
const log = require('../util/logger')
const founders = require('../../founders.json')

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

test('list founder addresses', t => {
	// Set up
	const discordId1 = 'founder1'
	const discordId2 = 'founder2'
	const discordId3 = 'notAFounder'

	// Test
	database.setAddress(discordId1, founders[0])
	database.setAddress(discordId2, founders[1])
	database.setAddress(discordId3, '0x0')

	// Validate
	let actuals = database.listFounderAddresses()
	t.is(2, actuals.length)
	t.is(founders[0], actuals[0].address)
	t.is(founders[1], actuals[1].address)
	t.is(discordId1, actuals[0].discord_id)
	t.is(discordId2, actuals[1].discord_id)
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

test('founder role', t => {
	// Set up
	const r1 = {
		server: '1234',
		role: '3214',
	}
	const r2 = {
		server: '987654',
		role: '654321',
	}

	database.setFounderRole(r1)
	database.setFounderRole(r2)

	// Test load
	let actual = database.listFounderRoles()
	t.is(2, actual.length)
	actual = database.getFounderRole(r1.server)
	t.is(r1.role, actual)

	// Test update
	r1.role = '55555'
	database.setFounderRole(r1)
	actual = database.getFounderRole(r1.server)
	t.is(r1.role, actual)

	// Test clear
	database.removeFounderRole(r1.server)
	database.removeFounderRole(r2.server)
	actual = database.listFounderRoles()
	t.is(0, actual.length)
})
