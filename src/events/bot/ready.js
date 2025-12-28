import { Events } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,

  async execute(interaction) {
    console.log("Avalon Online!");
  },
};
