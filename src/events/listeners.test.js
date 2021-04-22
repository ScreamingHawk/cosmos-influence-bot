const test = require('ava')
const sinon = require('sinon')
const listeners = require('./listeners')

// Mocks
const contractUtil = require('../util/contractUtil')

// Tests

test('asteroidScanned shows rarity', async t => {
	// Given
	const getSpectralType = sinon.stub()
	getSpectralType.withArgs(132621).returns('4')
	const mockContract = {
		getSpectralType,
	}
	sinon
		.stub(contractUtil, 'getContract')
		.withArgs('AsteroidFeatures')
		.returns(mockContract)

	// When
	const actual = await listeners.getAsteroidScannedMessage(132621, 1025) // Rarity Uncommon

	// Then
	t.is('Asteroid #132621 was scanned and is `Uncommon`', actual)
})
