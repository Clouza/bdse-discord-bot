const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { onValue, ref, set } = require("firebase/database");
const db = new (require("../api/index.js"))("../api/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("agreement")
    .setDescription("Agreement"),
  execute(interaction) {
    const agree = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("agree")
        .setLabel("I Absolutly Agree")
        .setStyle(ButtonStyle.Success)
    );

    onValue(
      ref(db, `users/${interaction.user.id}`),
      (snapshot) => {
        if (snapshot.exists()) {
          interaction.reply({
            ephemeral: true,
            content: `You are already agreed.`,
          });
        } else {
          interaction.reply({
            ephemeral: true,
            content: `Hi! ${interaction.user}`,
            embeds: [this.agreementEmbed()],
            components: [agree],
          });
        }
      },
      { onlyOnce: true }
    );
  },
  buttonTrigger(interaction) {
    const disabled = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("alreadyAgree")
        .setLabel("💯 Agreed")
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
    );
    interaction.update({
      ephemeral: true,
      content: `Thank you ${interaction.user} and welcome to the club 🍻`,
      embeds: [this.agreementEmbed()],
      components: [disabled],
    });

    set(ref(db, `users/${interaction.user.id}`), {
      agreement: true,
      balance: 0,
      checkIn: 0,
      username: interaction.user.username,
    });
  },
  agreementEmbed() {
    const agreement = new EmbedBuilder()
      .setAuthor({
        name: "BDSE Discord",
        iconURL:
          "https://cdn.discordapp.com/app-icons/1002833084959432754/f948f575686a6478b1745d7248f86eb6.png",
      })
      .setTitle("Agreement to use BDSE Discord Bot")
      .addFields({
        name: "You agree with",
        value:
          "- Discord ID will store on Google Firebase server \n- You agree to all the terms set by the developer",
      })
      .setFooter({
        text: "Valid since you read it - Last edited 3 November 2022",
      });
    return agreement;
  },
};
