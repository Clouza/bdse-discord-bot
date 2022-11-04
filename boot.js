const { Client, GatewayIntentBits, Partials, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
require("dotenv").config();

module.exports = class Boot {
  constructor() {
    const TOKEN = process.env.TOKEN;
    const CLIENT_ID = process.env.CLIENT_ID;
    const GUILD_ID = process.env.GUILD_ID; // development guild
    const ENV = process.env.ENV;

    // establish discord rest
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    // Discord client init
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Message, Partials.Channel],
    });
    this.client.login(TOKEN); // bot log in to discord

    // commands & events handler
    this.commands = new (require("./src/handlers/commandsHandler.js"))();
    this.events = new (require("./src/handlers/eventsHandler.js"))();

    // registry
    new (require("./registry.js"))(
      ENV,
      rest,
      Routes,
      CLIENT_ID,
      GUILD_ID,
      this.commands.getCommandsJSON()
    );
  }

  getClient() {
    return this.client;
  }

  getCommands() {
    return this.commands.getCommandsCollection();
  }

  getEvents() {
    return this.events.getEvents();
  }
};
