const influence = require('influence-utils')
const ethers = require('ethers')
const log = require('./logger')

const addresses = {
	AsteroidSale: '0xf8cB149E5B32299a6D99F4630731829C8D891258',
	AsteroidToken: '0x6e4c6D9B0930073e958ABd2ABa516b885260b8Ff',
	AsteroidScans: '0x9b811024635626bc37E5d294B384077AB25DCF62',
	AsteroidFeatures: '0x99Ce24101bc957A0d02EC65AB7e3B507Fee42a13',
	AsteroidNames: '0x7391833C841D8abf62F8ee332015723528035a99',
	CrewToken: '0x746db7b1728af413c4e2b98216c6171b2fc9d00e',
}
const contracts = {}

const initContracts = provider => {
	for (let name in addresses) {
		if (addresses[name] && influence.contracts[name]) {
			contracts[name] = new ethers.Contract(
				addresses[name],
				influence.contracts[name],
				provider,
			)
			log.debug(`Initialised ${name} contract`)
		}
	}
	log.debug('Initialised contracts')
}

const getContract = name => contracts[name]

module.exports = {
	initContracts,
	addresses,
	getContract,
}
