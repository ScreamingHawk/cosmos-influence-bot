const { ethers } = require('ethers')
const log = require('../util/logger')
const { setAddress } = require('../db/database')

let verificationLink

const pendingVerifications = {}

const initVerify = verificationLinkArg => {
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
	const uname = username.replace(/\s/g, '_')
	pendingVerifications[id] = {
		username: uname,
		address,
	}

	const link = `${verificationLink}?username=${uname}&address=${address}`

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
		const { username, address } = pendingVerifications[id]
		try {
			const signer = ethers.utils.verifyMessage(
				`${username} owns ${address}`,
				signature,
			)
			if (signer.toLowerCase() !== address) {
				return message.reply(
					'You signed the request with the wrong address. Please try again',
				)
			}
		} catch (err) {
			log.error('Unable to validate signature', err)
			return message.reply('Unable to validate that signature')
		}
		log.info(`Verified that ${username} owns ${address}`)
		setAddress(id, address)
		delete pendingVerifications[id]
		message.reply('Address verification complete 🚀')
	}
}

module.exports = {
	initVerify,
	prepareVerification,
	isPending,
	completeVerification,
}
