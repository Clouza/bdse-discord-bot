const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  execute(client, interaction) {
    const command = client.get(interaction.commandName);

    // check inteaction type
    switch (interaction.type) {
      case InteractionType.ModalSubmit:
        try {
          command.modalSubmit(interaction);
        } catch (error) {
          console.error(`[ MODAL_SUBMIT (${interaction.type}) ] - ${error}`);
        }
        break;
      case InteractionType.MessageComponent:
        try {
          if (interaction.isButton()) {
            let command = null;
            if (interaction.customId == "agree") {
              command = client.get("agreement");
            } else {
              command = client.get(interaction.message.interaction.commandName);
            }
            command.buttonTrigger(interaction);
          }
        } catch (error) {
          console.error(
            `[ MESSAGE_COMPONENT (${interaction.type}) ] - ${error}`
          );
        }
        break;
      default: // application command
        try {
          command.execute(interaction);
        } catch (error) {
          console.error(
            `[ APPLICATION_COMMAND (${interaction.type}) ] - ${error}`
          );
        }
        break;
    }
  },
};
