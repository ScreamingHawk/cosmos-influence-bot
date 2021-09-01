const { ethers } = require('ethers')

module.exports = {
	formatNumber: (num, fraction) =>
		num.toLocaleString(undefined, { minimumFractionDigits: fraction || 0 }),
	formatEther: ethers.utils.formatEther, // Expects BigNumber
	formatDollar: num => `$${Number.parseInt(num).toLocaleString('en-US')}`,
}
