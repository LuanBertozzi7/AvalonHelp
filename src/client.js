import { Client } from "discord.js";
import { intents } from "./config/intents.js";
import { loadCommands } from "./handlers/commandHandler.js";

export const client = new Client({ intents });
await loadCommands(client);
