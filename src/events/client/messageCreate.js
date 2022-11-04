const Number = require("../../helpers/number.js");
const { onValue, ref, set } = require("firebase/database");
const db = new (require("../../api/index.js"))("../api/config.js");

module.exports = {
  name: "messageCreate",
  execute(client, message) {
    let command = null;
    const prefix = "!";
    let params = [];

    if (message.content.includes(prefix)) {
      command = message.content.replace(prefix, "");
    } else {
      return;
    }

    if (message.content.includes(" ") && !message.author.bot) {
      params = command.split(" ").pop(0);
      command = command.split(" ")[0];
    } else {
      return;
    }

    switch (command) {
      case "cf":
        const userId = message.author.id;
        if (isNaN(parseInt(params))) {
          message.reply("Not a number!");
          return;
        }

        onValue(
          ref(db, `users/${userId}`),
          (snapshot) => {
            if (snapshot.exists()) {
              if (params > snapshot.val().balance) {
                message.reply(`You can't bet more than the money you have`);
              } else {
                const icon = ["head", "tail"];
                const random = Math.floor(Math.random() * icon.length);
                const coin = icon[random];
                if (coin == icon[0]) {
                  const data = snapshot.val();
                  data.balance = data.balance + params * 2;
                  set(ref(db, `users/${userId}`), data);

                  message.reply(
                    `Default position is **head**. The coin is ${coin} \nYou won __**$${new Number(
                      params * 2
                    ).commaSeparator()}**__`
                  );
                } else {
                  const data = snapshot.val();
                  data.balance = data.balance - params;
                  set(ref(db, `users/${userId}`), data);

                  message.reply(
                    `Default position is **head**. The coin is ${coin} \nYou lost __**$${new Number(
                      params
                    ).commaSeparator()}**__`
                  );
                }
              }
            } else {
              message.reply(
                `Type \n\`\`\`/agreemenet\`\`\` \nto use this quick command`
              );
            }
          },
          { onlyOnce: true }
        );

        break;
      default:
        // No command available
        return;
    }
  },
};
