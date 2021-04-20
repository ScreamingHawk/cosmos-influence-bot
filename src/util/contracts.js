const influence = require('influence-utils')
const ethers = require('ethers')
const addresses = {
	AsteroidToken: '0x6e4c6d9b0930073e958abd2aba516b885260b8ff',
	AsteroidScans: '0x9b811024635626bc37E5d294B384077AB25DCF62',
}

const getContract = (name, provider) => {
	if (addresses[name] && influence.contracts[name]) {
		return new ethers.Contract(
			addresses[name],
			influence.contracts[name],
			provider,
		)
	}
	return null
}

module.exports = {
	addresses,
	getContract,
}
