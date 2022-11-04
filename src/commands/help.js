const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Help list"),
  execute(interaction) {
    const help = new EmbedBuilder()
      .setAuthor({
        name: "BDSE Discord",
        iconURL:
          "https://cdn.discordapp.com/app-icons/1002833084959432754/f948f575686a6478b1745d7248f86eb6.png",
      })
      .setTitle("Help list")
      .setDescription("All commands list will appear here")
      .addFields({
        name: "Help",
        value: "/help - to see all commands available",
      })
      .addFields(
        {
          name: "\u200B",
          value: "```General Commands```",
        },
        {
          name: "Agreement",
          value: "/agreement - to see the terms",
        },
        {
          name: "Ping",
          value: "/ping - pong",
        }
      )
      .addFields(
        {
          name: "\u200B",
          value: "```Games Commands```",
        },
        {
          name: "Coin Flip",
          value: "/coinflip - pick head or tail to double your money",
        },
        {
          name: "Check In",
          value: "/checkin - check in everyday to get $1000 free",
        },
        {
          name: "Balance",
          value: "/balance - check your current balance",
        },
        {
          name: "Send",
          value: "/send - send your money to someone",
        }
      )
      .addFields(
        {
          name: "\u200B",
          value: "```Quick Commands```",
        },
        {
          name: "Coin Flip",
          value: "!cf [money] - Fill in the parameter [money] to place a bet",
        }
      )
      .setFooter({
        text: "BDSE Discord Bot - 2022",
      });

    interaction.reply({
      ephemeral: true,
      embeds: [help],
    });
  },
};
