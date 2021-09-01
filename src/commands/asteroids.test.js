const test = require('ava')
const sinon = require('sinon')
const asteroids = require('./asteroids')

const { TEST_ADDRESS } = require('../util/constants')

const database = require('../db/database')
const openseaApi = require('../util/openseaApi')
const logger = require('../util/logger')

// Mocks

const mockBot = {
	user: {
		username: 'username',
		avatarURL: () => 'avatar',
		displayAvatarURL: () => 'avatar',
	},
}

const mockUser = {
	id: 1,
	username: 'username',
}

//TODO There has to be a better way...
const createMessage = (
	fakeReply = () => {},
	fakeMention = () => {},
	fakeSend = () => {},
) => ({
	reply: fakeReply,
	channel: {
		send: fakeSend,
	},
	mentions: {
		users: {
			first: fakeMention,
		},
	},
	author: mockUser,
})

// Set Up

test.before(() => {
	asteroids.initAsteroids(mockBot, null)
	const sendErrStub = sinon.stub(logger, 'sendErr')
	sendErrStub.returns(null)
})

// Tests

test('showUserAsteroids for current user uses current user address', async t => {
	// Given
	const addressStub = sinon.stub(database, 'getAddress')
	addressStub.withArgs(mockUser.id).returns(TEST_ADDRESS)
	const openseaStub = sinon.stub(openseaApi, 'getUserAsteroids')
	openseaStub.returns([]) // Mock roids

	const fakeReply = sinon.fake()
	const fakeSend = sinon.fake()
	const mockMessage = createMessage(fakeReply, () => {}, fakeSend)

	// When
	await asteroids.showUserAsteroids(mockMessage, [])

	// Then
	t.is(TEST_ADDRESS, openseaStub.lastCall.firstArg)
})
