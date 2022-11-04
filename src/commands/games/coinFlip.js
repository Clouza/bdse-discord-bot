const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Number = require("../../helpers/number.js");
const { onValue, ref, set } = require("firebase/database");
const agreement = require("../agreement.js");
const db = new (require("../../api/index.js"))("../api/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Bet your lucky with Coin Flip 💸")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Input how much money to bet")
        .setRequired(true)
    ),
  execute(interaction) {
    const headTail = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("head")
          .setLabel("Head")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("tail")
          .setLabel("Tail")
          .setStyle(ButtonStyle.Primary)
      );

    const bet = new Number(
      interaction.options.get("bet").value
    ).commaSeparator();

    onValue(
      ref(db, `users/${interaction.user.id}`),
      (snapshot) => {
        if (snapshot.exists()) {
          if (interaction.options.get("bet").value > snapshot.val().balance) {
            interaction.reply({
              ephemeral: true,
              content: `You can't bet more than the money you have`,
            });
          } else {
            interaction.reply({
              ephemeral: false,
              content: `${interaction.user} bet __**$${bet}**__ \nPick head or tail to double your money`,
              components: [headTail],
            });
          }
        } else {
          agreement.execute(interaction);
        }
      },
      { onlyOnce: true }
    );
  },
  buttonTrigger(interaction) {
    const user = interaction.user;
    onValue(
      ref(db, `users/${user.id}`),
      (snapshot) => {
        const userChoose = interaction.customId;
        const money = interaction.message.content
          .split("**")[1]
          .split("$")[1]
          .replace(",", "");
        const icon = ["head", "tail"];
        const random = Math.floor(Math.random() * icon.length);

        const content = (user, bet, coin, message) => {
          return `${user} bet __**$${bet}**__ \nPick head or tail to double your money \n\nThe coin is **${coin}** \n${message}`;
        };

        let bet = null;
        if (userChoose === icon[random]) {
          const data = snapshot.val();
          data.balance = data.balance + money * 2;
          set(ref(db, `users/${user.id}`), data);

          bet = new Number(money * 2).commaSeparator();
          interaction.update({
            ephemeral: true,
            content: content(
              user,
              bet,
              icon[random],
              `Congrats ${user} get __**$${bet}**__`
            ),
            components: [],
          });
        } else {
          const data = snapshot.val();
          data.balance = data.balance - money;
          set(ref(db, `users/${user.id}`), data);

          bet = new Number(money).commaSeparator();
          interaction.update({
            ephemeral: true,
            content: content(
              user,
              bet,
              icon[random],
              `${user} lost __**$${bet}**__`
            ),
            components: [],
          });
        }
      },
      { onlyOnce: true }
    );
  },
};
