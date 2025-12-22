import { Events } from "discord.js";
import "dotenv/config";
// Instance && Intents
import { intents } from "./src/config/intents.js";
import { client } from "./src/client.js";

// error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag}`);
});

// log discord with tokenn
client.login(process.env.TOKEN);
