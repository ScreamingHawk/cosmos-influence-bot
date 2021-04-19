const test = require('ava')
const database = require('./database')

test.before(() => {
	database.initDatabase()
})

test('address table works', t => {
	// Set up
	const address = "abc123"
	const discordId = "xyz789"

	// Test
	database.setAddress(discordId, address)

	// Validate
	let actual = database.getAddress(discordId)
	t.is(address, actual)

	//TODO Clean Up
})
