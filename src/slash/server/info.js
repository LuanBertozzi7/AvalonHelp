import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("servidor")
    .setDescription("Informações sobre o servidor")
    .addSubcommand((sub) =>
      sub.setName("info").setDescription("informações sobre o servidor"),
    ),

  async execute(interaction) {
    const user = interaction.user;
    const member = interaction.member;
    const guild = interaction.guild;
    const owner = interaction.guild.fetchOwner();

    const subCommand = interaction.options.getSubcommand("info");
    if (!subCommand === "info") return;

    const roles =
      member.roles.cache
        .filter((role) => role.id !== guild.id)
        .map((role) => role.toString())
        .join(", ") || "Sem cargos no servidor...";

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("Informações Sobre o Servidor!")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        // Owner
        {
          name: "Dono",
          value: `${(await owner).user.tag}`,
          inline: true,
        },
        // Server Name
        {
          name: "Nome:",
          value: `**${guild.name}**`,
          inline: true,
        },
        // total members
        {
          name: "Membros:",
          value: `**${guild.memberCount}**`,
          inline: true,
        },
        // channels list
        {
          name: "Canais:",
          value: `**${guild.channels.cache.size}**`,
          inline: true,
        },
        // roles list
        {
          name: "Cargos:",
          value: `** - ${roles}**`,
          inline: false,
        },
      )
      .setFooter({
        text: `Servidor: ${guild.name}`,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
