import "dotenv/config";
import { REST, Routes } from "discord.js";

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

// limpa os comandos dessa guild
await rest.put(
  Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
  { body: [] }
);
console.log("Comandos da guild apagados");
