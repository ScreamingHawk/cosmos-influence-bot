const test = require('ava')
const sinon = require('sinon')
const help = require('./help')
const discordUtil = require('../util/discordUtil')

const mockBot = {
	user: {
		username: 'username',
		avatarURL: () => 'avatar',
	},
}

const createMessage = (fakeReply = () => {}, fakeSend = () => {}) => ({
	reply: fakeReply,
	channel: {
		send: fakeSend,
	},
})

const adminStub = sinon.stub(discordUtil, 'checkAdmin')

test.before(() => {
	help.initHelp(mockBot, '*')
})

test.afterEach(() => {
	adminStub.restore()
})

test('admin sees all help info', async t => {
	// Given
	adminStub.returns(true)

	const fakeSend = sinon.fake()
	const mockMessage = createMessage(() => {}, fakeSend)

	// When
	await help.showHelp(mockMessage, [])

	// Then
	t.is(1, fakeSend.firstArg.embed.fields.length)
})

test('non admin sees subset of help info', async t => {
	// Given
	adminStub.returns(false)

	const fakeSend = sinon.fake()
	const mockMessage = createMessage(() => {}, fakeSend)

	// When
	await help.showHelp(mockMessage, [])

	// Then
	t.is(1, fakeSend.firstArg.embed.fields.length)
})
