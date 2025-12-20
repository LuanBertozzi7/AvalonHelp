import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return; // is command?
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    console.log(interaction);

    await command.execute(interaction);
  },
};
