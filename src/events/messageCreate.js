import { askAvalon } from "../openIA/chatService.js";

// Stores the last time the bot spoke in each channel
// channelId -> timestamp
const recentBotMessages = new Map();

export default {
  name: "messageCreate",

  async execute(message) {
    // 1. Ignore bot messages
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();

    // 2. Explicit triggers
    const mentionedBot = message.mentions.users.has(message.client.user.id);

    const calledByName =
      content.includes("avalon") || content.includes("avalonhelp");

    // 3. Stop / end conversation commands
    const stopCommands = ["!stop", "!avalon"];

    const shouldStop = stopCommands.some(
      (cmd) => content === cmd || content.startsWith(cmd + " "),
    );

    // 4. If user asked the bot to stop, clear context and confirm
    if (shouldStop) {
      recentBotMessages.delete(message.channel.id);

      return message.reply("ok! até mais");
    }

    // 5. Generic / social messages that should NOT trigger the bot
    const genericMessages = ["boa noite", "bom dia", "boa tarde"];

    const isGenericMessage = genericMessages.some(
      (msg) => content === msg || content.startsWith(msg + " "),
    );

    // 6. Context window per channel
    const now = Date.now();
    const lastBotMessage = recentBotMessages.get(message.channel.id);
    const withinContextWindow =
      lastBotMessage && now - lastBotMessage < 2 * 60 * 1000; // 2 minutes

    /*
      Activation rules:
      - Always respond if explicitly mentioned or called by name
      - If NOT explicitly called:
          - Only respond inside the context window
          - AND ignore generic/social messages
    */
    if (
      !mentionedBot &&
      !calledByName &&
      (!withinContextWindow || isGenericMessage)
    ) {
      return;
    }

    // 7. Ignore empty messages
    if (!content) return;

    try {
      // 8. Typing indicator for better UX
      await message.channel.sendTyping();

      // 9. Call OpenAI service
      const response = await askAvalon(message.content);

      // 10. Reply in the same channel
      await message.reply(response);

      // 11. Update context timestamp for this channel
      recentBotMessages.set(message.channel.id, Date.now());
    } catch (error) {
      console.error("Error while calling OpenAI:", error);

      await message.reply("❌ Ocorreu um erro ao processar sua solicitação.");
    }
  },
};
