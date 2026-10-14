const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const activitiesData = require("../data/activities.json");

const databasePath = path.join(__dirname, "exploreeire.db");

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.log("There was a problem opening the database.");
    console.log(error.message);
  } else {
    console.log("Connected to the ExploreÉire database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      county TEXT NOT NULL,
      city TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      priceType TEXT NOT NULL,
      price REAL NOT NULL,
      durationMinutes INTEGER NOT NULL,
      environment TEXT NOT NULL,
      rating REAL NOT NULL,
      studentFriendly INTEGER NOT NULL,
      accessible INTEGER NOT NULL,
      featured INTEGER NOT NULL
    )
  `);

  const addActivity = db.prepare(`
    INSERT OR IGNORE INTO activities (
      id,
      name,
      county,
      city,
      category,
      description,
      priceType,
      price,
      durationMinutes,
      environment,
      rating,
      studentFriendly,
      accessible,
      featured
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  activitiesData.activities.forEach((activity) => {
    addActivity.run(
      activity.id,
      activity.name,
      activity.county,
      activity.city,
      activity.category,
      activity.description,
      activity.priceType,
      activity.price,
      activity.durationMinutes,
      activity.environment,
      activity.rating,
      activity.studentFriendly ? 1 : 0,
      activity.accessible ? 1 : 0,
      activity.featured ? 1 : 0
    );
  });

  addActivity.finalize();

  console.log("The activities table is ready.");
});

db.close((error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log("Database setup completed.");
  }
});