require('dotenv').config()
const Discord = require('discord.js')
const moment = require('moment')
const { BigNumber } = require('ethers')
const log = require('../util/logger')
const openseaApi = require('../util/openseaApi')
const { formatEther, formatDollar } = require('../util/format')
const { getMemberOrAddress } = require('../util/discordUtil')
const { getRoidLinks, getCrewLinks } = require('../util/common')

const CHECK_INTERVAL = 60 * 1000 // 60 sec
let salesInterval
let roidsLastChecked
let crewLastChecked

const enhanceRoidData = (embed, asset) => {
	embed.addField('Links', getRoidLinks(asset.token_id, true), false)
}

const enhanceCrewData = (embed, asset) => {
	embed.addField('Links', getCrewLinks(asset.token_id, true), false)
}

const postSales = async (bot, channel, orders, enhance) => {
	if (orders && orders.asset_events) {
		log.debug(`Got ${orders.asset_events.length} sales`)
		if (orders.asset_events.length > 0) {
			for (const event of orders.asset_events) {
				try {
					const { asset, payment_token, seller, winner_account } = event

					if (!asset) {
						// This is a bundle. Skip it
						continue
					}

					const totalGwei = BigNumber.from(event.total_price)
					const totalEther = totalGwei.mul(
						Number.parseFloat(payment_token.eth_price),
					)
					const totalDollar =
						Number.parseFloat(formatEther(totalGwei)) * payment_token.usd_price

					// Amounts
					const formattedEther = formatEther(totalEther)
					const formattedDollar = formatDollar(totalDollar)

					// Discord
					if (channel) {
						try {
							const embed = new Discord.MessageEmbed().setColor(0x66ccff)

							embed
								.setTitle(`#${asset.token_id} ${asset.name} was sold`)
								.setImage(asset.image_url)

							// Amounts
							embed.addField('Ethereum', `Ξ${formattedEther}`, true)
							embed.addField('USD', `${formattedDollar}`, true)
							embed.addField('Sale Token', payment_token.symbol, true)

							// Addresses
							const sellerTag = await getMemberOrAddress(
								channel.guild,
								seller.address,
							)
							const winnerTag = await getMemberOrAddress(
								channel.guild,
								winner_account.address,
							)
							embed.addField('From', `${sellerTag}`)
							embed.addField('To', `${winnerTag}`)

							// Enhance embed with specific data
							enhance(embed, asset)

							embed.setFooter(
								'Data provided by OpenSea',
								bot.user.displayAvatarURL(),
							)

							channel.send({ embed })
						} catch (err) {
							log.sendErr(`Error with Discord: ${err}`)
						}
					}
				} catch (err) {
					log.sendErr(bot, `Error reading sale: ${err}`)
				}
			}
		}
	}
}

// Toggles on first attempt
let checkRoids = false

const checkSales = async (bot, channel) => {
	checkRoids = !checkRoids
	if (checkRoids) {
		log.debug('Running check asteroid sales')
		const newNow = moment()
		const orders = await openseaApi.getAsteroidSaleEvents(roidsLastChecked)
		if (orders && orders.asset_events && orders.asset_events.length > 0) {
			roidsLastChecked = newNow
		}
		await postSales(bot, channel, orders, enhanceRoidData)
	} else {
		log.debug('Running check crew sales')
		const newNow = moment()
		const orders = await openseaApi.getCrewSaleEvents(crewLastChecked)
		if (orders && orders.asset_events && orders.asset_events.length > 0) {
			crewLastChecked = newNow
		}
		await postSales(bot, channel, orders, enhanceCrewData)
	}
}

const initSales = async bot => {
	// sales
	roidsLastChecked = moment()
	crewLastChecked = moment()
	if (salesInterval) {
		clearInterval(salesInterval)
	}
	try {
		const { SALES_CHANNEL_ID } = process.env
		const channel = await bot.channels.fetch(SALES_CHANNEL_ID)
		log.sendInfo(
			bot,
			`Cosmos initialised for sales ${channel.guild?.name}'s ${channel.name}: ${SALES_CHANNEL_ID}`,
		)

		salesInterval = setInterval(() => checkSales(bot, channel), CHECK_INTERVAL)
		// Run it now
		checkSales(bot, channel)

		log.info('Configured sales')
	} catch (err) {
		log.sendErr(bot, 'Discord channel not found')
	}
}

module.exports = {
	initSales,
}
