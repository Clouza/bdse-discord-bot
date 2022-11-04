const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong"),
  execute(interaction) {
    interaction.reply({
      ephemeral: true,
      content: `Hi! ${interaction.user}`,
    });
  },
};
