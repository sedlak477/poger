import { ChatInputCommandInteraction, Collection, REST, Routes, SlashCommandBuilder } from "discord.js";
import { client } from "./bot.js";
import { config } from "../config.js";
import { readdir } from "fs/promises";
import { fileURLToPath, URL } from "url";
import { join } from "path";

export const commands = new Collection<string, SlashCommand>();

const commandsDirectory = fileURLToPath(new URL("commands", import.meta.url));
const commandFiles = await readdir(commandsDirectory);

// Dynamically import all commands from commands folder
for (const file of commandFiles) {
  if (file.endsWith(".js")) {
    const { default: command } = await import(join(commandsDirectory, file));
    commands.set(command.data.name, command);
    console.log(`Loaded command '${command.data.name}'.`);
  }
}

export function deploy(): Promise<void> {
  const rest = new REST({}).setToken(config.discordToken);

  return rest.put(Routes.applicationCommands(config.discordId), { body: commands.map(cmd => cmd.data.toJSON()) })
    .then(() => console.log(`Registered commands.`))
    .catch(err => console.error(`Error registering commands: ${err}`));
}

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  console.log(`Received command ${interaction.commandName}`);

  try {
    await command?.execute(interaction);
  } catch (error) {
    console.error(`Error executing command! ${error}`);
    console.error(error);
    if (interaction.deferred) {
      await interaction.editReply({ content: 'Ah fuck' });
    } else {
      await interaction.reply({ content: 'Ah fuck' });
    }
  }

});

export interface SlashCommand {
  data: Partial<SlashCommandBuilder>;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
