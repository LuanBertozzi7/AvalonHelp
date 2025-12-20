import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url); // Get the current {{ file.js }} path
const __dirname = path.dirname(__filename); // Get the current {{ directory }} path

export async function loadCommands(client) {
  client.commands = new Map(); // Initialize command's collection { "ping", {data: ..., execute: ...} }

  const commandsPath = path.join(__dirname, "../slashCommand");
  
  const commandFiles = fs
    .readdirSync(commandsPath) // Read all files in slashCommand
    .filter((file) => file.endsWith(".js")); // filter only .js files

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    client.commands.set(command.default.data.name, command.default);
  }
}
