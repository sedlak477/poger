import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../commands.js";

const ping: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default ping;
