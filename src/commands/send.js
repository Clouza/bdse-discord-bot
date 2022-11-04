const { SlashCommandBuilder } = require("discord.js");
const Number = require("../helpers/number.js");
const { onValue, ref, set } = require("firebase/database");
const agreement = require("./agreement.js");
const db = new (require("../api/index.js"))("../api/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send money to someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member to send the money")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("nominal")
        .setDescription("Set how much money to send to someone")
        .setRequired(true)
    ),
  execute(interaction) {
    const userId = interaction.user.id;
    const nominal = interaction.options.get("nominal").value;

    onValue(
      ref(db, `users/${userId}`),
      (snapshot) => {
        if (snapshot.exists()) {
          const other = interaction.options.get("user");
          const otherId = interaction.options.get("user").value;

          if (nominal > snapshot.val().balance) {
            interaction.reply({
              ephemeral: true,
              content: `You can't send more than the money you have`,
            });
          } else {
            if (other.user.bot) {
              interaction.reply({
                ephemeral: true,
                content: `You can't send your money to a **bot** (don't ask why)`,
              });
            } else {
              onValue(
                ref(db, `users/${otherId}`),
                (other) => {
                  const data = other.val();
                  data.balance = data.balance + nominal;
                  set(ref(db, `users/${otherId}`), data);
                },
                { onlyOnce: true }
              );

              const data = snapshot.val();
              data.balance = data.balance - nominal;
              set(ref(db, `users/${userId}`), data);

              interaction.reply({
                ephemeral: false,
                content: `Send __**$${new Number(
                  nominal
                ).commaSeparator()}**__ to ${other.user}`,
              });
            }
          }
        } else {
          agreement.execute(interaction);
        }
      },
      { onlyOnce: true }
    );
  },
};
