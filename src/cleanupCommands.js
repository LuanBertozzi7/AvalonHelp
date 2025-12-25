import "dotenv/config";
import { REST, Routes } from "discord.js";

const { BOT_ID, BOT_TOKEN, GUILD_ID } = process.env;

if (!BOT_ID || !BOT_TOKEN) {
  throw new Error(
    "BOT_ID e BOT_TOKEN são necessários para limpar comandos duplicados."
  );
}

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

function findDuplicates(commands) {
  const seen = new Set();
  const duplicates = [];

  for (const command of commands) {
    if (seen.has(command.name)) {
      duplicates.push(command);
    } else {
      seen.add(command.name);
    }
  }

  return duplicates;
}

async function deleteCommands(scope, commandIds) {
  for (const { id, name } of commandIds) {
    const route =
      scope === "guild"
        ? Routes.applicationGuildCommand(BOT_ID, GUILD_ID, id)
        : Routes.applicationCommand(BOT_ID, id);

    await rest.delete(route);
    console.log(`Removido /${name} duplicado (${scope}) [${id}]`);
  }
}

async function cleanupScope(scope, commands) {
  const duplicates = findDuplicates(commands);
  if (!duplicates.length) return;

  console.log(
    `Encontrados ${
      duplicates.length
    } comandos duplicados em ${scope}: ${duplicates
      .map((cmd) => `/${cmd.name} (${cmd.id})`)
      .join(", ")}`
  );

  await deleteCommands(scope, duplicates);
}

async function cleanupDuplicates() {
  const globalRoute = Routes.applicationCommands(BOT_ID);
  const guildRoute =
    GUILD_ID && Routes.applicationGuildCommands(BOT_ID, GUILD_ID);

  console.log("Buscando comandos registrados...");
  const [globalCommands, guildCommands] = await Promise.all([
    rest.get(globalRoute),
    guildRoute ? rest.get(guildRoute) : Promise.resolve([]),
  ]);

  await cleanupScope("global", globalCommands);
  if (guildRoute) {
    await cleanupScope("guild", guildCommands);
  }

  if (guildRoute && guildCommands.length && globalCommands.length) {
    const guildNames = new Set(guildCommands.map((cmd) => cmd.name));
    const overlap = globalCommands.filter((cmd) => guildNames.has(cmd.name));

    if (overlap.length) {
      console.log(
        `Comandos duplicados entre global e guild detectados: ${overlap
          .map((cmd) => `/${cmd.name} (${cmd.id})`)
          .join(", ")}`
      );
      await deleteCommands("global", overlap);
    }
  }

  console.log("Limpeza concluída.");
}

cleanupDuplicates().catch((error) => {
  console.error("Erro ao limpar comandos duplicados:", error);
});
