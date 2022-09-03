import { config as configDotenv } from "dotenv";

configDotenv();

export const config = {
  discordToken: process.env.DISCORD_TOKEN,
  discordId: process.env.DISCORD_ID,
};
