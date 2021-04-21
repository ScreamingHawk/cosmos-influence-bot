# Cosmos Bot

Cosmos is a discord bot that interfaces with [Influence](https://influenceth.io).

## Development

### Build

Install `node` and `yarn`

Install dependencies

```
yarn
```

Copy the example `.env` file and update the contents with the bot's token.

```
cp .env.example .env
```

### Run

Run the bot

```
yarn start
```

Alternatively, run the bot in the background

```
nohup yarn start >> server.log 2>&1 &
```

Run the frontend website (for address verification)

```
yarn frontend
```

### Test

Run the unit tests with

```
yarn test
```

You can also run the bot having it only respond to a single user.
Edit the `.env` file and include a parameter `TEST_USER=<username>` where `<username>` is the username that the bot will listen to. Then run the bot with `yarn start`

## Credits

[Michael Standen](https://michael.standen.link)

This software is provided under the [MIT License](https://tldrlegal.com/license/mit-license) so it's free to use so long as you give me credit.

To support the project you can donate some ether to `0x455fef5aeCACcd3a43A4BCe2c303392E10f22C63`.
