import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return; // is command?
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
  },
};
