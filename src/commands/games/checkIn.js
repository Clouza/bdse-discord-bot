const { SlashCommandBuilder } = require("discord.js");
const Number = require("../../helpers/number.js");
const { onValue, ref, set } = require("firebase/database");
const agreement = require("../agreement.js");
const db = new (require("../../api/index.js"))("../api/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("checkin")
    .setDescription("Check In everyday to get free money"),
  execute(interaction) {
    const userId = interaction.user.id;
    const currentDate = new Date().getTime();
    const nextCheckIn = currentDate + 24 * 60 * 60;

    onValue(
      ref(db, `users/${userId}`),
      (snapshot) => {
        if (snapshot.exists()) {
          const money = 1000;
          const daily = new Number(money).commaSeparator();
          const balance = new Number(
            snapshot.val().balance + money
          ).commaSeparator();

          if (snapshot.val().checkIn > currentDate) {
            interaction.reply({
              ephemeral: true,
              content: `You can't get money more than 1 day`,
            });
          } else {
            const data = snapshot.val();
            data.checkIn = nextCheckIn;
            data.balance = data.balance + money;
            set(ref(db, `users/${userId}`), data);

            interaction.reply({
              ephemeral: false,
              content: `You get 💳 __**$${daily}**__ today! \nCurrent balance: 💳 __**$${balance}**__`,
            });
          }
        } else {
          agreement.execute(interaction);
        }
      },
      {
        onlyOnce: true,
      }
    );
  },
};
