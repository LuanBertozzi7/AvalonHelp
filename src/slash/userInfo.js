import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Obter informações sobre um usuário")
    .addUserOption((option) =>
      option
        .setName("username")
        .setDescription("Selecione o usuário que deseja obter informações")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("username") || interaction.user;
    const member =
      interaction.options.getMember("username") || interaction.member;

    // timestamp calculator
    const createdTimestamp = Math.floor(user.createdTimestamp / 1000);
    const accountAgeDays = Math.floor(
      (Date.now() - createdTimestamp) / 86400000
    );

    const guild = interaction.guild;

    const userEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("Informações sobre o usuário!")
      .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
      .addFields(
        // User Name
        {
          name: "Nome:",
          value: `**${user.username}**`,
          inline: false,
        },
        // Account Creation Date
        {
          name: "Conta criada:",
          value: `<t:${Math.floor(
            user.createdTimestamp / 1000
          )}:F> (${accountAgeDays} dias)`,
          inline: false,
        }
      ) // addFields
      // Footer
      .setFooter({
        text: `Servidor: ${guild.name}`,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    const embeds = [userEmbed];

    if (member) {
      const joinedTimestamp = Math.floor(member.joinedTimestamp / 1000);
      const memberAgeDays = Math.floor(
        (Date.now() - joinedTimestamp) / 86400000
      );

      // get roles
      const roles = member.roles.cache
        .filter((r) => r.id !== interaction.guild.id)
        .sort((a, b) => b.position - a.position)
        .map((r) => `<@&${r.id}>`)
        .slice(0, 20);

      // special roles
      const isBooster = member.premiumSince !== null;
      const hasAdmin = member.permissions.has("Administrator");
      const hasMod =
        member.permissions.has("ModerateMembers") ||
        member.permissions.has("KickMembers") ||
        member.permissions.has("BanMembers");

      // curious
      const curiosity = [];

      if (user.bot) {
        curiosity.push("👾 Bot");
      }

      if (isBooster) {
        curiosity.push("🚀 Booster");
      }

      if (hasAdmin) {
        curiosity.push("Admin");
      } else if (hasMod) {
        curiosity.push("🔧 Mod");
      }

      // muted?
      if (
        member.communicationDisabledUntil &&
        member.communicationDisabledUntil > Date.now()
      ) {
        curiosity.push("🔇 Temporariamente Silenciado!");
      }

      const memberEmbed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setTitle("Informações sobre o Membro!")
        .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
        .addFields(
          {
            name: "Entrou no Servidor em",
            value: `<t:${joinedTimestamp}:f>\n(há ${memberAgeDays} dias)`,
            inline: false,
          },
          {
            name: "Maior Cargo",
            value: `${member.roles.highest}`,
            inline: true,
          },
          {
            name: "Total de Cargos",
            value: `${member.roles.cache.size - 1}`,
            inline: true,
          },
          {
            name: "Nota:",
            value: curiosity.join("\n"),
            inline: false,
          }
        );

      if (roles.length > 0) {
        memberEmbed.addFields({
          name: `Cargos [${roles.length}]`,
          value: roles.join(", "),
          inline: true,
        });
      }

      if (isBooster) {
        const boostTimestamp = Math.floor(member.premiumSince / 1000);
        memberEmbed.addFields({
          name: "Impulsionado o servidor desde",
          value: `<t:${boostTimestamp}:f>`,
          inline: false,
        });
      }
      embeds.push(memberEmbed);
    }
    await interaction.editReply({
      embeds: embeds,
    });
  },
};
