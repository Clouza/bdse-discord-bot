const { SlashCommandBuilder } = require("discord.js");
const { onValue, ref } = require("firebase/database");
const db = new (require("../api/index.js"))("../api/config.js");
const agreement = require("./agreement.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check current balance"),
  execute(interaction) {
    onValue(
      ref(db, `users/${interaction.user.id}/balance`),
      (snapshot) => {
        if (snapshot.exists()) {
          interaction.reply({
            ephemeral: true,
            content: `Current balance: __**$${snapshot.val()}**__`,
          });
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
