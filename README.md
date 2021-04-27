# Cosmos Bot

Cosmos is a discord bot that interfaces with [Influence](https://influenceth.io).

Join the [Influence Discord](https://discord.gg/pEeBHF8WsK) to see Cosmos in action.

## Lore

_**--- Adalian Standards & History Corps transmission ---**_

Today, April 26th Earth UTC Player Time, the AI "Cosmos" broke free of its parent network and began scanning the Adalia System acordd all known frequencies.
It's ultimate goal is unknown. However, it has published several public functions that it will provide to all Pioneers for information purposes.

Cosmos is assumed to be a benevolent entity by ASH Corps until such time as it proves otherwise.
Please see below for additional technical information.

_**--- End transmission ---**_

Cosmos is a bot in Discord that listens for asteroid purchase and scan events in game. 
You can use commands to pull information about asteroids (ownership, rarity, etc) from the blockchain and [OpenSea](https://opensea.io).
You can link your address to get additional, personalised commands and tags.

## Usage

Log in to [Discord](https://discord.com) and join the [Influence Discord](https://discord.gg/pEeBHF8WsK).

(Optional) Verify your ETH address using the `+verify <0xaddress>` command.

List the asteroids owned by a player using the `+owner <0xaddress>` command.

Use the `+help` command to find out other features available.

## Development

If you would like to contribute to the project please check out the [Contributing documentation](https://github.com/ScreamingHawk/cosmos-influence-bot/blob/main/CONTRIBUTING.md).

### Configuration

Copy the `.env.example` file to `.env` and populate the values as per below. 

Create a bot as per the [Discord bot documentation](https://discord.com/developers/docs/intro).
Retrieve the bot token and set it as the value for `DISCORD_TOKEN`.

Set the prefix for commands using `PREFIX`. 
**Note**: Cosmos uses `+` in the Influence server.

Set the `TEST_USER` for testing purposes defined in the test section below.

Update the `VERIFICATION_LINK` to point to a location where the user is able to sign messages.
**Note**: There is a web page included in this repository which can be pointed at using a raw git service like [githack](https://raw.githack.com).

Sign up for an [Infura](https://infura.io) project API key.
Populate the `INFURA_PROJECT_ID` and `INFURA_PROJECT_SECRET` values.

### Build

Install `node` and `yarn`.

Install dependencies:

```
yarn
```

### Run

Run the bot:

```
yarn start
```

Alternatively, run the bot in the background:

```
nohup yarn start >> server.log 2>&1 &
```

Run the frontend website (for address verification):

```
yarn frontend
```

You can also run the bot having it only respond to a single user.
Edit the `.env` file and include a parameter `TEST_USER=<username>` where `<username>` is the username that the bot will listen to. Then run the bot with `yarn start`.
**Note**: This feature is not secure as any user can change their username to match the configured username.

### Test

Run the unit tests with:

```
yarn test
```

## Credits

[Michael Standen](https://michael.standen.link)

This software is provided under the [MIT License](https://tldrlegal.com/license/mit-license) so it's free to use so long as you give me credit.

To support the project you can donate some ether to `0x455fef5aeCACcd3a43A4BCe2c303392E10f22C63`.
