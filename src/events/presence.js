const ACTIVITIES = [
	{ type: 'WATCHING', activity: 'the stars' },
	{ type: 'LISTENING', activity: 'comm signals' },
	{ type: 'PLAYING', activity: 'with subsystems' },
	{ type: 'COMPETING', activity: 'market trades' },
]
const UPDATE_INTERVAL = 10 * 60 * 1000 // 10 min

const updatePresence = bot => {
	const index = Math.floor(Math.random() * (ACTIVITIES.length - 1) + 1)
	const activity = ACTIVITIES[index]
	bot.user.setActivity(activity.activity, { type: activity.type })
}

const initPresence = bot => {
	// Update it now
	updatePresence(bot)
	// And on a schedule
	setInterval(() => {
		updatePresence(bot)
	}, UPDATE_INTERVAL)
}

module.exports = {
	initPresence,
}
