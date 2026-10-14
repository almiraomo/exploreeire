const sqlite3 = require("sqlite3").verbose();
const path = require("path");


const databasePath = path.join(__dirname, "exploreeire.db");

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.log("There was a problem connecting to the database.");
    console.log(error.message);
  } else {
    console.log("Connected to the ExploreÉire database.");
  }
});

module.exports = db;