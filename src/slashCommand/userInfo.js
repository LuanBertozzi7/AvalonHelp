import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Obter informações sobre um usuário"),
  async execute(interaction) {
    const user = interaction.user;
    const member = interaction.member;
    const guild = interaction.guild;

    const roles =
      member.roles.cache // a list (collection) of roles the member has
        .filter((role) => role.id != guild.id) // @everyone role is excluded(has the same ID as guild)
        .map((role) => role.toString())
        .join(", ") || "Não possui Cargo :(";

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("Informações")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        // User Name
        {
          name: "Usuário",
          value: `**${user.username}**`,
          inline: true,
        },
        // User surname
        {
          name: "Apelido",
          value: `**${member.nickname || "N/T"}**`,
          inline: true,
        },
        // Is Bot?
        {
          name: "Bot?",
          value: `**${user.bot ? "Sim" : "Não"}**`,
          inline: true,
        },
        // Account Creation Date
        {
          name: "Conta criada:",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        // Roles
        {
          name: "Cargos:",
          value: roles,
        },
        // Joined At
        {
          name: "Entrou no servidor:",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
          inline: true,
        }
      ) // addFields
      // Footer
      .setFooter({
        text: `Servidor: ${guild.name}`,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    // responding to the interaction
    await interaction.reply({ embeds: [embed] });
  },
};
