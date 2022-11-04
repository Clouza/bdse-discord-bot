module.exports = class Registry {
  constructor(status, rest, routes, cliendId, guildId = "", commands = []) {
    if (status === "development") {
      // register all commands to the development guild
      rest.put(routes.applicationGuildCommands(cliendId, guildId), {
        body: commands,
      });
    } else {
      // production (all guild)
    }
  }
};
