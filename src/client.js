import { Client } from "discord.js";
import { intents } from "./config/intents.js";
import { loadCommands } from "./handlers/commandHandler.js";
import interactionCreate from "./events/interactionCreate.js";

export const client = new Client({ intents });
await loadCommands(client);

client.on(
  interactionCreate.name,
  async (...args) => interactionCreate.execute(...args),
);
