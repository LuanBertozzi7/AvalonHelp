import { Events, version as djsVersion } from "discord.js";
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

client.once(Events.ClientReady, (readyClient) => {
  const guildCount = readyClient.guilds.cache.size;
  const userCount = readyClient.guilds.cache.reduce(
    (acc, guild) => acc + guild.memberCount,
    0
  );

  console.log("=================================");
  console.log("AvalonHelp is online!");
  console.log(`Bot: ${readyClient.user.tag}`);
  console.log(`Bot ID: ${readyClient.user.id}`);
  console.log(`Servers: ${guildCount}`);
  console.log(`Users (approx): ${userCount}`);
  console.log(`Ping: ${readyClient.ws.ping}ms`);
  console.log(`Node.js: ${process.version}`);
  console.log(`Discord.js: v${djsVersion}`);
  console.log(`Started at: ${new Date().toLocaleString("pt-BR")}`);
  console.log("=================================");
});

// load events
await loadEvents(client);
client.login(process.env.TOKEN);
