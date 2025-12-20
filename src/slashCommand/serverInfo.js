import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Informações sobre o servidor"),
  async execute(interaction) {
    const user = interaction.user;
    const member = interaction.member;
    const guild = interaction.guild;
    const owner = interaction.guild.fetchOwner();

    const roles =
      member.roles.cache
        .filter((role) => role.id != guild.id)
        .map((role) => role.toString())
        .join(", ") || "Sem cargos no servidor...";

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("Informações Sobre o Servidor!")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setURL("https://discord.gg/urAU9Uv3")
      .addFields(
        // Owner
        {
          name: "Dono",
          value: `${(await owner).user.tag}`,
          inline: false,
        },
        // Server Name
        {
          name: "Nome:",
          value: `**${guild.name}**`,
          inline: false,
        },
        // total members
        {
          name: "Membros:",
          value: `**${guild.memberCount}**`,
          inline: false,
        },
        // channels list
        {
          name: "Canais:",
          value: `**${guild.channels.cache.size}**`,
          inline: false,
        },
        // roles list
        {
          name: "Cargos:",
          value: `** - ${roles}**`,
          inline: false,
        }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
