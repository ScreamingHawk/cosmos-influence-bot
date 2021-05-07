module.exports = {
	formatNumber: (num, fraction) =>
		num.toLocaleString(undefined, { minimumFractionDigits: fraction || 0 }),
}
