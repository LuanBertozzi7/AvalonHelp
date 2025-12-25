import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import os from "os";

const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(0);

export default {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Mostra informações sobre o bot!"),

  async execute(interaction) {
    const botUser = interaction.client.user;

    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();
    const usedMem = totalRAM - freeRAM;
    const memusagePercent = ((usedMem / totalRAM) * 100).toFixed(1);

    const cpuModel = os.cpus()[0].model;

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("AvalonHelp")
      .setThumbnail(botUser.displayAvatarURL({ size: 512, dynamic: true }))
      .addFields(
        {
          name: "📊 Estatísticas",
          value: [
            `**Servidores:** ${interaction.client.guilds.cache.size}`,
            `**Usuários:** ${interaction.client.guilds.cache.reduce(
              (acc, guild) => acc + guild.memberCount,
              0
            )}`,
            `**Author:** [Luan Bertozzi](https://github.com/LuanBertozzi7)`,
            `**Uptime:** ${Math.floor(
              interaction.client.uptime / 1000 / 60
            )} minutos`,
          ].join("\n"),
          inline: true,
        },
        {
          name: "🖥️ Sistema",
          value: [
            `**Node.js:** ${process.version}`,
            `**discord.js:** v14`,
            `**OS:** ${os.type()} ${os.release()}`,
            `**CPU:** ${cpuModel}`,
            `**RAM:** ${toMB(usedMem)}MB / ${toMB(
              totalRAM
            )}MB (${memusagePercent}%)`,
          ].join("\n"),
          inline: false,
        },
        {
          name: "Links",
          value: "https://github.com/LuanBertozzi7/AvalonHelp",
          inline: false,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
