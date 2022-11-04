const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

module.exports = class Api {
  constructor(configPath) {
    const { firebaseConfig } = require(configPath);

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);

    return db;
  }
};
