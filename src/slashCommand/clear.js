import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";

const minMessages = 1;
const maxMessages = 100;

function isOlderThan14Days(message) {
  const diff = Date.now() - message.createdTimestamp;
  return diff > 14 * 24 * 60 * 60 * 1000;
}

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Apaga mensagens no canal")
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription(
          `Número de mensagens a serem apagadas (entre ${minMessages} e ${maxMessages})`
        )
        .setRequired(true)
        .setMinValue(minMessages)
        .setMaxValue(maxMessages)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("quantidade");

    if (!interaction.inGuild()) {
      return interaction.reply({
        content: "Este comando só pode ser usado em servidores.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!interaction.channel?.isTextBased()) {
      return interaction.reply({
        content: "Use este comando apenas em canais de texto.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.reply({
        content: "Você não tem permissão para apagar mensagens.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const botPermissions = interaction.channel.permissionsFor(
      interaction.client.user
    );

    if (
      !botPermissions ||
      !botPermissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.reply({
        content: "Eu não tenho permissão para gerenciar mensagens neste canal.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    let totalMessagesDeleted = 0;

    try {
      const messages = await interaction.channel.messages.fetch({
        limit: amount,
      });

      if (messages.size === 0) {
        return interaction.editReply({
          content: "❌ Nenhuma mensagem encontrada para deletar.",
        });
      }

      const recentMessages = messages.filter((msg) => !isOlderThan14Days(msg));

      const oldMessages = messages.filter(isOlderThan14Days);

      if (recentMessages.size > 0) {
        const deleted = await interaction.channel.bulkDelete(
          recentMessages,
          true
        );
        totalMessagesDeleted += deleted.size;
      }

      for (const msg of oldMessages.values()) {
        try {
          await msg.delete();
          totalMessagesDeleted++;
          await new Promise((r) => setTimeout(r, 1000));
        } catch (err) {
          console.error("Erro ao deletar mensagem antiga:", msg.id, err);
        }
      }

      const embed = new EmbedBuilder()
        .setTitle("🗑️ Mensagens Deletadas")
        .setDescription(
          `**Total apagado:** ${totalMessagesDeleted} mensagem(ns)`
        )
        .setColor(0x2ecc71)
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("/clear command error:", error);

      await interaction.editReply({
        content: "❌ Ocorreu um erro inesperado ao tentar apagar as mensagens.",
      });
    }
  },
};
