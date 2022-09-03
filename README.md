# Poger

> :warning: **This project is work-in-progress and not even the core functionallity is implemented yet!**

Small [Discord](https://discord.com/) bot for playing audio streams from [YouTube](https://www.youtube.com/). Intended to be self hosted.

## Deployment
Just build and start the included docker container with the environment variables `DISCORD_ID` and `DISCORD_TOKEN` containing your Discord application ID and bot token. You can get them in the [Discord developer portal](https://discord.com/developers/applications).

```
docker build -t poger .
docker run -d --name discord-bot -e DISCORD_TOKEN=<bot token> -e DISCORD_ID=<application id> poger
```

## Commands

### `/play <url>`
Join the channel you are in and start streaming the specified URL.

### `/ping`
The bot anwers with `Pong!`. Mainly for testing if the bot is up and running.

## Issues & Contributions
I have limited time, this project is mainly for fun for me. If I get around to it I'll try to respond to issues or PRs, but I can't promise anything.

## License

MIT
