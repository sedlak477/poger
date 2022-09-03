import { Client, GatewayIntentBits } from "discord.js";
import { config } from "../config.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log("Bot connected.");
});

client.login(config.discordToken);
