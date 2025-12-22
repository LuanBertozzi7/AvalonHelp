import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";

const minMessages = 1;
const maxMessages = 100;

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Apaga mensagens no canal")
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription(
          `Número de mensagens a serem apagadas - entre ${minMessages} e ${maxMessages}`
        )
        .setRequired(true)
        .setMaxValue(maxMessages)
        .setMinValue(minMessages)
    ),

  checkMessageTime(message) {
    const messageTimestamp = message.createdTimestamp;
    const currentTimestamp = Date.now();
    const differenceInMilliSeconds = currentTimestamp - messageTimestamp;
    const differenceInDays = differenceInMilliSeconds / (1000 * 60 * 60 * 24);

    return differenceInDays > 14;
  },

  async execute(interaction) {
    const amount = interaction.options.getInteger("quantidade");
    let totalMessagesDeleted = 0;

    await interaction.deferReply({
      flags: 64, // MessageFlags.Ephemeral (ephemeral is deprecated in discord.js v14)
    });

    if (amount < minMessages || amount > maxMessages) {
      console.log(amount);
      return interaction.editReply({
        content: `Informe um número entre ${minMessages} e ${maxMessages}.`,
      });
    }

    if (!interaction.channel || !interaction.channel.isTextBased()) {
      return interaction.editReply({
        content: "Use este comando somente em canais de textos.",
      });
    }

    const botPermissions = interaction.channel.permissionsFor(
      interaction.client.user
    );

    if (
      !botPermissions ||
      !botPermissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.editReply({
        content: "Eu não tenho permissão para gerenciar mensagens neste canal!",
      });
    }

    try {
      // search messages
      const messages = await interaction.channel.messages.fetch({
        limit: amount,
      });

      const recentMessages = messages.filter(
        (msg) => !this.checkMessageTime(msg)
      );

      const oldMessages = messages.filter((msg) => this.checkMessageTime(msg));

      if (messages.size === 0) {
        return await interaction.editReply({
          content: "❌ Nenhuma mensagem encontrada para deletar.",
        });
      }

      // Delete recent messages in bulk
      if (recentMessages.size > 0) {
        try {
          const deletedBulk = await interaction.channel.bulkDelete(
            recentMessages,
            true
          );
          totalMessagesDeleted += deletedBulk.size;
        } catch (error) {
          console.error("/clear bulk delete error:", error);
        }
      }

      // Delete old messages one by one
      if (oldMessages.size > 0) {
        for (const msg of oldMessages.values()) {
          try {
            await msg.delete();
            totalMessagesDeleted++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second, to avoid discord rate limits
          } catch (error) {
            console.error(
              "error deleting old message in /clear: ",
              msg.id,
              error
            );
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
      console.error("/clear command error:", error);

      await interaction.editReply({
        content: "Ocorreu um erro inesperado ao tentar deletar mensagens.",
      });
    }
  },
};
