import { Events } from "discord.js";
import "dotenv/config";
// Instance && Intents
import { intents } from "./src/config/intents.js";
import { client } from "./src/client.js";

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag}`);
});

// log discord with tokenn
client.login(process.env.TOKEN);
