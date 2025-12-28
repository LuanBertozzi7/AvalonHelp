import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export async function loadEvents(client) {
  const eventsPath = path.join(process.cwd(), "src/events");

  const items = fs.readdirSync(eventsPath);

  let loadedEvents = 0;

  for (const item of items) {
    const itemPath = path.join(eventsPath, item);
    const stats = fs.statSync(itemPath);


    if (stats.isDirectory()) {
      const files = fs
        .readdirSync(itemPath)
        .filter(file => file.endsWith(".js"));

      for (const file of files) {
        const filePath = path.join(itemPath, file);
        await registerEvent(client, filePath, `${item}/${file}`);
        loadedEvents++;
      }
    }

    else if (stats.isFile() && item.endsWith(".js")) {
      await registerEvent(client, itemPath, item);
      loadedEvents++;
    }
  }

  console.log(`[EVENTS] ${loadedEvents} eventos carregados`);
}

async function registerEvent(client, filePath, label) {
  try {
    const event = (await import(pathToFileURL(filePath))).default;

    if (
      typeof event?.name !== "string" ||
      typeof event?.execute !== "function"
    ) {
      console.warn(`[EVENTS] Evento inválido ignorado: ${label}`);
      return;
    }

    const handler = async (...args) => {
      try {
        await event.execute(...args, client);
      } catch (err) {
        console.error(
          `[EVENTS] Erro ao executar evento "${event.name}" (${label})`,
          err,
        );
      }
    };

    if (event.once === true) {
      client.once(event.name, handler);
    } else {
      client.on(event.name, handler);
    }

    console.log(`[EVENTS] Evento carregado: ${event.name} (${label})`);
  } catch (err) {
    console.error(`[EVENTS] Erro ao carregar evento: ${label}`, err);
  }
}
