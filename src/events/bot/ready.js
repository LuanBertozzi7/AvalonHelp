import { Events } from "discord.js";
import { client } from "./src/client.js";

export default {
  name: Events.ClientReady,
  once: true,

  async execute(interaction) {
    console.log("Avalon Online!");
  },
};

client.login(process.env.BOT_TOKEN); 