const Discord = require('discord.js')
const discordUtil = require('../util/discordUtil')

let bot, prefix, HELP_DETAILS

const initHelp = (botArg, prefixArg) => {
	bot = botArg
	prefix = prefixArg
	HELP_DETAILS = {
		// General help
		about: {
			admin: false,
			short: 'About Cosmos',
			detailed: [
				'Cosmos is an interactive Discord bot that integrates with Influence.',
				'Cosmos is open source. You can find the code at https://github.com/ScreamingHawk/cosmos-influence-bot',
				'Consider donating to `0x455fef5aeCACcd3a43A4BCe2c303392E10f22C63` to support my continued existence.',
			].join('\n'),
		},
		verify: {
			admin: false,
			short: 'Verify your ETH address',
			detailed: [
				`\`${prefix}verify <0xaddress>\``,
				'Link your ETH address with your discord account.',
				'Linking your address will give you access to other commands that need to know who you are.',
			].join('\n'),
		},
		address: {
			admin: false,
			short: 'View the address of a user',
			detailed: [
				`\`${prefix}address\``,
				`\`${prefix}address @<username>\``,
				'View the ETH address linked to a user (or to yourself).',
				'The user must have linked their address using the `verify` command.',
			].join('\n'),
		},
		user: {
			admin: false,
			short: 'View the user of an address',
			detailed: [
				`\`${prefix}user <0xaddress>\``,
				'View the user linked to an ETH address.',
				'The user must have linked their address using the `verify` command.',
			].join('\n'),
		},
		asteroid: {
			admin: false,
			short: 'View the details of an asteroid',
			detailed: [
				`\`${prefix}asteroid <id>\``,
				`\`${prefix}roid <id>\``,
				'View the details of an asteroid using information from Opensea.',
				'Opensea only exposes asteroids that have been minted and so these feature does not yet support unowned asteroids.',
			].join('\n'),
		},
		owned: {
			admin: false,
			short: 'View the asteroids owned by a user',
			detailed: [
				`\`${prefix}owned\``,
				`\`${prefix}owned @<username>\``,
				'View a list of all asteroids owned by a user (or yourself).',
				'The user must have linked their address using the `verify` command.',
			].join('\n'),
		},
		events: {
			admin: false,
			short: 'List the events that are reported in this channel',
			detailed: [
				`\`${prefix}events\``,
				'Lists the events that are reported in this channel.',
				'Ask an admin if you would like the event values updated.',
			].join('\n'),
		},
		event: {
			admin: true,
			short: 'Toggle if an event is reported in this channel',
			detailed: [
				`\`${prefix}event <event>\``,
				'Toggle whether or not an event is reported in this channel.',
			].join('\n'),
		},
	}
}

const showHelp = async (message, args) => {
	// Embedded help
	const embed = new Discord.MessageEmbed()
		.setTitle('Help')
		.setAuthor(bot.user.username, bot.user.avatarURL())
		.setColor(0xd82929)

	const helpCommand = args[0]
	const isAdmin = discordUtil.checkAdmin(message, false)

	if (helpCommand && helpCommand in HELP_DETAILS) {
		// Show the help info for a single command
		const helpDetail = HELP_DETAILS[helpCommand]
		if (helpDetail.admin && !isAdmin) {
			return message.reply(
				`the ${helpCommand} command is only available for admins`,
			)
		}
		embed.setDescription(
			`Here's some more info about the ${helpCommand} command`,
		)
		embed.addFields({ name: helpCommand, value: helpDetail.detailed })
	} else {
		// Complete help
		embed.setDescription(
			`Here's all the things I can do!\nType \`${prefix}help command\` for more info about a command`,
		)
		for (const [command, value] of Object.entries(HELP_DETAILS)) {
			if (!(value.admin && !isAdmin)) {
				embed.addFields({ name: `${prefix}${command}`, value: value.short })
			}
		}
	}

	return message.channel.send({ embed })
}

module.exports = {
	initHelp,
	showHelp,
}
