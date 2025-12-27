import { Events, EmbedBuilder } from "discord.js";
import welcomeConfig from "../config/welcome.json" with { type: "json" };

export default {
  name: "guildMemberAdd",
  once: false,

  async execute(member) {
    const channel = member.guild.channels.cache.get(
      welcomeConfig.welcomeChannelId
    );

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(11027200) // dark orange
      .setTitle("Bem vindo(a)!")
      .setDescription(
        `${member} Entrou no **${member.guild.name}**!\n ` + `ID: ${member.id}`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `total de membros: ${member.guild.memberCount}!`,
      })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};
