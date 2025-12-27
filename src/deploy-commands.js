import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { REST, Routes } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

async function loadSlashCommands() {
  const commandsDir = path.join(__dirname, "slash");
  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".js"));

  const commands = [];
  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const commandModule = await import(pathToFileURL(filePath));
    const command = commandModule.default;
    if (!command?.data) {
      console.warn(`Ignorando ${file}: falta export default com .data`);
      continue;
    }
    commands.push(command.data.toJSON());
  }
  return commands;
}

async function deploy() {
  const commands = await loadSlashCommands();
  const route = process.env.GUILD_ID
    ? Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID)
    : Routes.applicationCommands(process.env.BOT_ID);

  try {
    console.log(
      `Registrando ${commands.length} Slash-Commands em ${
        process.env.GUILD_ID ? "guild" : "global"
      }...`
    );

    await rest.put(route, { body: commands });
    console.log("Slash-Commands registrados com sucesso!");
  } catch (e) {
    console.error("Erro ao registrar comandos:", e);
  }
}

deploy();
