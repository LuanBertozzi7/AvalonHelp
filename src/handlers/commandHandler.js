import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

export async function loadCommands(client) {
  client.commands = new Map(); // { "ping": { data, execute } }

  const commandsPath = path.join(process.cwd(), "src/slash");

  if (!fs.existsSync(commandsPath)) {
    console.warn(`Pasta de comandos não encontrada: ${commandsPath}`);
    return;
  }

  const commandFiles = collectSlashFiles(commandsPath);
  const allowList = getAllowList();

  for (const filePath of commandFiles) {
    const commandModule = await import(pathToFileURL(filePath));
    const command = commandModule.default;

    if (!command?.data || !command?.execute) {
      console.warn(
        `[WARNING] Ignorando ${path.relative(
          commandsPath,
          filePath,
        )}: comando inválido`,
      );
      continue;
    }

    if (allowList && !allowList.includes(command.data.name)) {
      console.log(
        `[INFO] Ignorando ${command.data.name} (${path.relative(
          commandsPath,
          filePath,
        )}): fora do filtro`,
      );
      continue;
    }

    client.commands.set(command.data.name, command);
  }

  console.log(`Carregados ${client.commands.size} slash commands`);
}
