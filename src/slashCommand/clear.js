import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clear messages in a channel")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete")
        .setRequired(true)
        .setMaxValue(100)
        .setMinValue(1)
    ),

  checkMessageTime(message) {
    const messageTimestamp = message.createdTimestamp;
    const currentTimestamp = Date.now();
    const differenceInMilliSeconds = currentTimestamp - messageTimestamp;
    const differenceInDays = differenceInMilliSeconds / (1000 * 60 * 60 * 24);

    return differenceInDays > 14;
  },

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    await interaction.deferReply({
      flags: 64, // MessageFlags.Ephemeral (ephemeral is deprecated in discord.js v14)
    });

    let totalMessagesDeleted = 0;

    try {
      // search messages
      const messages = await interaction.channel.messages.fetch({
        limit: amount,
      });

      if (messages.size === 0) {
        return await interaction.editReply({
          content: "❌ Nenhuma mensagem encontrada para deletar.",
        });
      }

      const oldMessages = [];
      const recentMessages = [];

      messages.forEach((msg) => {
        if (this.checkMessageTime(msg)) {
          oldMessages.push(msg);
        } else {
          recentMessages.push(msg);
        }
      });

      // Delete recent messages in bulk
      if (recentMessages.length > 0) {
        try {
          const deletedBulk = await interaction.channel.bulkDelete(
            recentMessages,
            true
          );
          totalMessagesDeleted += deletedBulk.size;
        } catch (error) {
          console.log(`Erro ao deletar em bulk: ${error}`);
        }
      }

      // Delete old messages one by one
      if (oldMessages.length > 0) {
        for (const msg of oldMessages) {
          try {
            await msg.delete();
            totalMessagesDeleted++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second, to avoid discord rate limits
          } catch (error) {
            console.log(`error: ${error}`);
          }
        }
      }

      const embed = new EmbedBuilder()
        .setTitle("🗑️ Mensagens Deletadas")
        .setDescription(
          `**Total deletado:** ${totalMessagesDeleted} mensagem(ns)\n`
        )
        .setColor(0x00ff00)
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: " error, verify bot permissions!",
      });
    }
  },
};
