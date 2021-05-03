module.exports = {
	apps: [
		{
			name: 'Cosmos',
			script: 'src/bot.js',
			watch: ['src'],
			watch_delay: 1000,
			ignore_watch: ['node_modules'],
			error_file: 'server.err.log',
			out_file: 'server.out.log',
		},
	],
}
