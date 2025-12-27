import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { AllowedMentionsTypes, REST, Routes } from "discord.js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

function collectSlashFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectSlashFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getAllowList() {
  const allowListEnv = process.env.COMMAND_ALLOWLIST || process.env.COMMANDS;
  if (!allowListEnv) return null;

  return allowListEnv
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

async function loadSlashCommands() {
  const commandsDir = path.join(__dirname, "slash");
  const files = collectSlashFiles(commandsDir);
  const allowList = getAllowList();

  const commands = [];

  for (const filePath of files) {
    const commandModule = await import(pathToFileURL(filePath));
    const command = commandModule.default;

    if (!command?.data) {
      console.warn(
        `[WARNING] Ignorando ${path.relative(
          commandsDir,
          filePath
        )}: falta export default com .data`
      );
      continue;
    }

    if (allowList && !allowList.includes(command.data.name)) {
      console.log(
        `[INFO] Ignorando ${command.data.name} (${path.relative(
          commandsDir,
          filePath
        )}): fora do filtro`
      );
      continue;
    }

    commands.push(command.data.toJSON());
  }

  return { commands, allowList };
}

function resolveRoute() {
  if (!process.env.BOT_ID) {
    throw new Error("BOT_ID is not defined in .env");
  }

  return process.env.GUILD_ID
    ? Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID)
    : Routes.applicationCommands(process.env.BOT_ID);
}

async function deploy() {
  console.log("Registrando via deploy-commands.js");

  try {
    const { commands, allowList } = await loadSlashCommands();

    if (allowList?.length) {
      console.log(`Filtro aplicado: ${allowList.join(", ")}`);
    }

    const route = resolveRoute();
    const scope = process.env.GUILD_ID ? "guild" : "global";

    console.log(`Registrando ${commands.length} Slash-Commands em ${scope}...`);

    await rest.put(route, { body: commands });
    console.log(
      "Slash command's registrado com sucesso via deploy-commands.js"
    );
  } catch (e) {
    console.error("Erro ao registrar comandos via deploy-commands", e);
  }
}

deploy();
