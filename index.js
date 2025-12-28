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

await loadEvents(client);