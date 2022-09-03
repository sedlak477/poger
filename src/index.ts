import { createInterface } from "readline/promises";
import { deploy } from "./bot/commands.js";
import { client } from "./bot/bot.js";

async function runCLI() {
  const cli = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const q = await cli.question("> ");

    switch (q.trim()) {
      case "deploy commands":
        await deploy();
        break;

      case "":
        break;
      default:
        console.log("Unrecognized command.");
    }

  }
}

client.once("ready", runCLI);
