const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = class Events {
  constructor() {
    const root = "./src/events";
    const events = [];
    this.events = new Collection();

    fs.readdirSync(root).filter((e) => {
      events.push(e);
    });

    for (const event of events) {
      fs.readdirSync(path.join(root, event)).filter((f) => {
        const file = require(`../events/${event}/${f}`);
        this.events.set(file.name, file);
      });
    }
  }

  getEvents() {
    return this.events;
  }
};
