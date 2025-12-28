import { Events, EmbedBuilder } from "discord.js";
import welcomeConfig from "../../config/welcome.json" with { type: "json" };

export default {
  name: Events.GuildMemberAdd,
  once: false,

  async execute(member, client) {
    try {
      const channel = await member.guild.channels
        .fetch(welcomeConfig.welcomeChannelId)
        .catch(() => null);

      if (!channel || !channel.isTextBased()) {
        console.warn("canal não encontrado, ou não é um canal de texto");
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(11027200) // dark orange
        .setTitle("")
        .setDescription(`${member} Entrou no **${member.guild.name}**!`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: `total de membros: ${member.guild.memberCount}!`,
        })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("ocorreu um erro ao enviar a mensagem de boas vindas em " + welcomeConfig.welcomeChannelId, error);
    }
  },
};
