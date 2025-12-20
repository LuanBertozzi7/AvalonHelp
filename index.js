import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
// Instance && Intents
import { client } from "./src/client.js";

client.once(Events.ClientReady, (readyClient) => {

  console.log(`Ready! Logado em ${readyClient.user.tag}`);
});

// log discord with tokenn
client.login(process.env.TOKEN);
