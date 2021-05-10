const log = require('../util/logger')
const database = require('../db/database')

const setFounderRole = async message => {
	const role = message.mentions.roles.first()
	const { guild } = message
	if (!role) {
		// No role detected. Remove it
		log.info(`Removing founder role for "${guild.name}"`)
		database.removeFounderRole(guild.id)
		return message.reply('removed the founder role for this server')
	}
	log.debug(`Setting founder role to "${role.name}" in "${guild.name}"`)
	database.setFounderRole({
		server: guild.id,
		role: role.id,
	})
	message.reply(
		`set the founder role to ${role.name} for this server.\nAdding the role for verified founders`,
	)

	const founders = database.listFounderAddresses()
	for (let founder of founders) {
		const member = await guild.members.fetch(founder.discord_id)
		if (member) {
			log.debug(`${member.user.username} is a founder`)
			member.roles.add(role, 'User is a founder')
		}
	}
}

module.exports = {
	setFounderRole,
}
