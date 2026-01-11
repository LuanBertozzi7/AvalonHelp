import { Events, EmbedBuilder } from "discord.js";
import { channelsConfig } from "../../config/channel-config.json" with { type: "json" };

export default {
  name: Events.GuildMemberAdd,
  once: false,

  async execute(member) {
    try {
      const channel = await member.guild.channels
        .fetch(channelsConfig.welcome)
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
      const channel = await member.guild.channels
        .fetch(channelsConfig.log)
        .catch(() => null);
      
      if (channel && channel.isTextBased()) {
        await channel.send(
          "erro ao enviar mensagem de boas-vindas em " + channelsConfig.welcome
        );
      }
      console.error(error);
    }
  },
};
