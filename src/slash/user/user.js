import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("usuario")
    .setDescription("User-related commands")

    // /usuario avatar
    .addSubcommand((sub) =>
      sub
        .setName("avatar")
        .setDescription("Shows the user's avatar")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("Select a user")
            .setRequired(false),
        ),
    )

    // /usuario info
    .addSubcommand((sub) =>
      sub
        .setName("info")
        .setDescription("Shows information about the user")
        .addUserOption((option) =>
          option
            .setName("username")
            .setDescription("Select a user")
            .setRequired(false),
        ),
    ),

  async execute(interaction) {
    // Which subcommand was used
    const subcommand = interaction.options.getSubcommand();

    // Target user (fallback to command author)
    const user =
      interaction.options.getUser("username") || interaction.user;

    // Guild member object (if the user is in the server)
    const member =
      interaction.options.getMember("username") || interaction.member;

    /* ======================================================
     * /usuario avatar
     * ====================================================== */
    if (subcommand === "avatar") {
      const avatarURL = user.displayAvatarURL({
        size: 1024,
        extension: "png",
        dynamic: true,
      });

      const undertaleSelf = [
        "Apesar de tudo, ainda é você.",
        "Seu reflexo sorri de volta. Determinação +10.",
        "Você sente o cheiro de canela e butterscotch.",
        "A jukebox toca um tema familiar… (♪ Your Best Friend).",
        "Seus olhos brilham com esperança.",
        "Você se lembra: salvar não é apenas um menu.",
        "A jornada continua. HP restaurado.",
      ];

      const undertaleOthers = [
        "Um novo personagem aparece no SAVE.",
        "A amizade enche a sala de determinação.",
        "Você ouve passos suaves pelo corredor.",
        "Esse olhar lembra alguém do Ruins.",
        "A barra de EXP permanece zerada. Continue sendo bondoso.",
        "O vento traz risadas de Snowdin.",
        "Uma foto para a página do diário.",
      ];

      const isSelf = user.id === interaction.user.id;
      const phrases = isSelf ? undertaleSelf : undertaleOthers;
      const footerText =
        phrases[Math.floor(Math.random() * phrases.length)] || "";

      const embed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setAuthor({
          name: user.username,
          iconURL: avatarURL,
        })
        .setImage(avatarURL)
        .setFooter({
          text: footerText,
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Open avatar in browser")
          .setStyle(ButtonStyle.Link)
          .setURL(avatarURL),
      );

      return interaction.reply({
        embeds: [embed],
        components: [row],
      });
    }

    /* ======================================================
     * /usuario info
     * ====================================================== */
    if (subcommand === "info") {
      await interaction.deferReply();

      const guild = interaction.guild;

      // Account creation timestamp (Unix)
      const createdTimestamp = Math.floor(user.createdTimestamp / 1000);

      // Account age in days
      const accountAgeDays = Math.floor(
        (Date.now() - user.createdTimestamp) / 86400000,
      );

      // User information embed
      const userEmbed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setTitle("User Information")
        .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
        .addFields(
          {
            name: "Username",
            value: `**${user.username}**`,
          },
          {
            name: "User ID",
            value: `**${user.id}**`,
          },
          {
            name: "Account created at",
            value: `<t:${createdTimestamp}:F> (${accountAgeDays} days ago)`,
          },
        )
        .setFooter({
          text: `Server: ${guild.name}`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();

      const embeds = [userEmbed];

      // If the user is a member of the guild, add member info
      if (member) {
        const joinedTimestamp = Math.floor(member.joinedTimestamp / 1000);
        const memberAgeDays = Math.floor(
          (Date.now() - member.joinedTimestamp) / 86400000,
        );

        // Get member roles (excluding @everyone)
        const roles = member.roles.cache
          .filter((r) => r.id !== guild.id)
          .sort((a, b) => b.position - a.position)
          .map((r) => `<@&${r.id}>`)
          .slice(0, 20);

        // Flags and badges
        const isBooster = member.premiumSince !== null;
        const hasAdmin = member.permissions.has(
          PermissionsBitField.Flags.Administrator,
        );
        const hasMod =
          member.permissions.has(
            PermissionsBitField.Flags.ModerateMembers,
          ) ||
          member.permissions.has(
            PermissionsBitField.Flags.KickMembers,
          ) ||
          member.permissions.has(
            PermissionsBitField.Flags.BanMembers,
          );

        const notes = [];

        if (user.bot) notes.push("🤖 Bot");
        if (isBooster) notes.push("🚀 Server Booster");
        if (hasAdmin) notes.push("🛡️ Administrator");
        else if (hasMod) notes.push("🔧 Moderator");

        // Check if the member is timed out
        if (
          member.communicationDisabledUntil &&
          member.communicationDisabledUntil > Date.now()
        ) {
          notes.push("🔇 Temporarily muted");
        }

        // Member information embed
        const memberEmbed = new EmbedBuilder()
          .setColor(0x2f3136)
          .setTitle("Member Information")
          .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
          .addFields(
            {
              name: "Joined the server at",
              value: `<t:${joinedTimestamp}:F> (${memberAgeDays} days ago)`,
            },
            {
              name: "Highest role",
              value: `${member.roles.highest}`,
              inline: true,
            },
            {
              name: "Total roles",
              value: `${member.roles.cache.size - 1}`,
              inline: true,
            },
            {
              name: "Notes",
              value: notes.length ? notes.join("\n") : "None",
            },
          );

        if (roles.length) {
          memberEmbed.addFields({
            name: `Roles [${roles.length}]`,
            value: roles.join(", "),
          });
        }

        if (isBooster) {
          const boostTimestamp = Math.floor(member.premiumSince / 1000);
          memberEmbed.addFields({
            name: "Boosting since",
            value: `<t:${boostTimestamp}:F>`,
          });
        }

        embeds.push(memberEmbed);
      }

      return interaction.editReply({
        embeds,
      });
    }
  },
};
