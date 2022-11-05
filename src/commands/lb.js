const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Number = require("../helpers/number.js");
const String = require("../helpers/string.js");
const { onValue, ref, set, get } = require("firebase/database");
const db = new (require("../api/index.js"))("../api/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("Show leaderboard"),
  async execute(interaction) {
    const top = await this.learderboard().then((data) => {
      const ts = [];
      if (data.length <= 5) {
        for (i = 0; i < 5; i++) {
          if (data[i] !== undefined) {
            const name = new String(data[i].name).firstLetterUpperCase();
            const balance = data[i].balance;
            data[i] = `${name} - __**${balance}**__`;
            ts.push(data[i]);
          } else {
            ts.push("-");
          }
        }
      } else {
        for (i = data.length; i > 5; i--) {
          if (data[i] !== undefined) {
            const name = new String(data[i].name).firstLetterUpperCase();
            const balance = data[i].balance;
            data[i] = `${name} - __**${balance}**__`;
            ts.push(data[i]);
          } else {
            ts.push("-");
          }
        }
      }
      return ts;
    });

    interaction.reply({
      ephemeral: false,
      content: `\`\`\`
Top 5 richest people in BDSE Discord\`\`\`
1. ${top[0]}
2. ${top[1]}
3. ${top[2]}
4. ${top[3]}
5. ${top[4]} `,
    });
  },
  async learderboard() {
    const snapshot = await get(ref(db, "users"));
    const top = [];
    for (const user in snapshot.val()) {
      if (snapshot.exists()) {
        let obj = {};
        const name = snapshot.val()[user].username;
        const balance = snapshot.val()[user].balance;

        obj["name"] = name;
        obj["balance"] = "$" + new Number(balance).commaSeparator();
        top.push(obj);
        // top.push([snapshot.val()[user].username, snapshot.val()[user].balance]);
      }
    }
    return (
      top
        // .filter((data) => {
        //   return data !== undefined;
        // })
        .sort((a, b) => {
          return a[1] - b[1];
        })
    );
  },
};
