const SQLite = require('better-sqlite3')
const sql = new SQLite('./database.sqlite')
const log = require('../util/logger')

const initDatabase = () => {
	// Addresses table
	let table = sql
		.prepare(
			'SELECT count(*) FROM sqlite_master WHERE type = \'table\' AND name = \'addresses\';',
		)
		.get()
	if (!table['count(*)']) {
		log.info('Creating addresses table')
		sql
			.prepare('CREATE TABLE addresses (address TEXT PRIMARY KEY, discord_id TEXT);')
			.run()
		sql.prepare('CREATE UNIQUE INDEX idx_addresses_id ON addresses (address);').run()
		// Set some SQL things
		sql.pragma('synchronous = 1')
		sql.pragma('journal_mode = wal')
	}
}

// Addresses

const getAddress = discordId => {
	let address = sql.prepare('SELECT * FROM addresses WHERE discord_id = ?').get(discordId)
	if (address) {
		return address.address
	}
	return null
}

const setAddress = (discordId, address) => {
	sql
		.prepare(
			'INSERT OR REPLACE INTO addresses (address, discord_id) VALUES (@address, @discordId);',
		)
		.run({
			address,
			discordId,
		})
}

module.exports = {
	initDatabase,
	getAddress,
	setAddress,
}
