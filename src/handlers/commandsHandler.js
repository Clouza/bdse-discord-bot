const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = class Commands {
  constructor() {
    const root = "./src/commands";
    const commands = [];
    this.commands = new Collection();

    fs.readdirSync(root).filter((f) => {
      const dirPath = path.join(root, f);
      const isDir = fs.lstatSync(dirPath).isDirectory();

      if (isDir) {
        this.getFile(path.join(root, f)).forEach((value) => {
          commands.push(path.join(f, value));
        });
      } else {
        commands.push(f);
      }
    });

    for (const file of commands) {
      const setCommand = require(`../commands/${file.replace(/\\/g, "/")}`);
      const command = file.split("\\");
      this.commands.set(
        command[command.length - 1].replace(".js", "").toLowerCase(), // ['ping.js']
        setCommand
      );
    }
  }

  getDir(path) {
    return fs.readdirSync(path).filter((dir) => !dir.endsWith(".js"));
  }

  getFile(path) {
    return fs.readdirSync(path).filter((file) => file.endsWith(".js"));
  }

  getCommandsJSON() {
    const commands = [];
    this.commands.map((d) => {
      commands.push(d.data?.toJSON());
    });
    return commands.filter((f) => f != undefined);
  }

  getCommandsCollection() {
    return this.commands;
  }
};
