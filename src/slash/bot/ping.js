import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com pong'),

  async execute(interaction) {
    const client = interaction.client;
    // gateway ping (webSocket)
    const gatewayPing = client.ws.ping;
    // API Ping (round-trip real)
    const ping = Date.now() - interaction.createdTimestamp;
    // ShardInfo (with fallback)
    const shardId = interaction.guild?.shardId ?? client.shard?.ids?.[0] ?? 0;

    const totalShards = client.shard?.count ?? 1;

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setAuthor({
        name: 'Pong!',
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        [
          `**Shard:** ${shardId + 1}/${totalShards}`,
          `**Gateway Ping:** ${gatewayPing}ms`,
          `**API Ping:** ${ping}ms`,
        ].join('\n')
      )
      .setFooter({
        text: `${client.user.username}`,
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
