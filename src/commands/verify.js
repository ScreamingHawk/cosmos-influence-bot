const { ethers } = require('ethers')
const { randomBytes } = require('crypto')
const log = require('../util/logger')
const database = require('../db/database')
const founders = require('../../founders.json')

let bot, verificationLink

const pendingVerifications = {}

const initVerify = (botArg, verificationLinkArg) => {
	bot = botArg
	verificationLink = verificationLinkArg
}

const validAddressError =
	'you must specify a valid address: `verify <0xaddress>`'

// Prepare address verification
const prepareVerification = async (message, args) => {
	log.debug('Preparing verification')
	// Validate inputs
	if (!args.length) {
		return message.reply(validAddressError)
	}
	const address = args[0].toLowerCase()
	if (!ethers.utils.isAddress(address)) {
		return message.reply(validAddressError)
	}

	const { id, username } = message.author
	const uname = username.replace(/[^a-zA-Z0-9]/g, '_')
	const nonce = randomBytes(16).toString('hex')
	pendingVerifications[id] = {
		username: uname,
		nonce,
		address,
	}

	const link = `${verificationLink}?username=${uname}&address=${address}&nonce=${nonce}`

	if (message.guild) {
		message.reply('initiating private communications...')
	}
	return message.author.send(
		[
			`Please verify you own the address \`${address}\` at the following link:`,
			link,
			'Then copy the signature and paste it into **this** chat.',
		].join('\n'),
	)
}

const isPending = message =>
	pendingVerifications[message.author.id] !== undefined

// Complete the verification process
const completeVerification = async (message, args) => {
	const signature = args[0]
	if (isPending(message) && signature) {
		const { id } = message.author
		const { username, address, nonce } = pendingVerifications[id]
		try {
			const signer = ethers.utils.verifyMessage(
				`Sign this message to prove ${username} owns the address: ${address}\n\nCode: ${nonce}`,
				signature,
			)
			if (signer.toLowerCase() !== address) {
				return message.reply(
					'You signed the request with the wrong address. Please try again',
				)
			}
		} catch (err) {
			log.sendErr(
				bot,
				`Unable to validate signature of ${username}: ${err.message}`,
			)
			return message.reply('Unable to validate that signature')
		}
		log.info(`Verified that ${username} owns ${address}`)
		database.setAddress(id, address)
		delete pendingVerifications[id]
		message.reply('Address verification complete 🚀')

		if (founders.includes(address.toLowerCase())) {
			// Check and add founder role in each server
			log.info(`${username} is a founder`)
			const founderRoles = database.listFounderRoles()
			for (let founderRole of founderRoles) {
				try {
					const guild = await bot.guilds.fetch(founderRole.server)
					const member = await guild.members.fetch(id)
					const role = await guild.roles.fetch(founderRole.role)
					if (member && role) {
						log.debug(`${username} is a founder in ${guild.name}`)
						member.roles.add(role, 'User is a founder')
					}
				} catch (err) {
					// Ignore. This happens when a user is not in the server
				}
			}
		} else {
			log.debug(`${username} is not a founder`)
		}
	}
}

module.exports = {
	initVerify,
	prepareVerification,
	isPending,
	completeVerification,
}
