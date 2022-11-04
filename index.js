const Boot = new (require("./boot.js"))();

// run commands
Boot.getEvents().map((event) => {
  if (event.once) {
    Boot.getClient().once(event.name, (...args) => {
      event.execute(...args);
    });
  } else {
    Boot.getClient().on(event.name, (...args) => {
      event.execute(Boot.getCommands(), ...args);
    });
  }
});
