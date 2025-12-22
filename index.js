import { Events } from "discord.js";
import "dotenv/config";
// Instance && Intents
import { client } from "./src/client.js";
import { loadEvents } from "./src/loaders/eventLoader.js";

// error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// load events
await loadEvents(client);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag}`);
});

// log discord with tokenn
client.login(process.env.TOKEN);
