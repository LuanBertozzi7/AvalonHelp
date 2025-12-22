import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export async function loadEvents(client) {
  const eventsPath = path.join(process.cwd(), "src/events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(pathToFileURL(filePath))).default;

    if (!event?.name || !event?.execute) {
      console.warn(`Evento inválido ignorado: ${file}`);
      continue;
    }

    client.on(event.name, (...args) => event.execute(...args));
  }
}
