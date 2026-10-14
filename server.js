const express = require("express");
const path = require("path");
const db = require("./database/database");

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


app.get("/api/welcome", (req, res) => {
  res.json({
    application: "ExploreÉire",
    message: "Welcome to ExploreÉire",
    description:
      "An interactive Irish experience planner for international students."
  });
});


app.get("/api/activities", (req, res) => {
  const sql = "SELECT * FROM activities";

  db.all(sql, [], (error, rows) => {
    if (error) {
      console.log(error.message);

      return res.status(500).json({
        message: "There was a problem retrieving the activities."
      });
    }

    const activities = rows.map((activity) => {
      return {
        ...activity,
        studentFriendly: activity.studentFriendly === 1,
        accessible: activity.accessible === 1,
        featured: activity.featured === 1
      };
    });

    res.json({ activities });
  });
});


app.get("/api/activities/:id", (req, res) => {
  const activityId = req.params.id;

  const sql = "SELECT * FROM activities WHERE id = ?";

  db.get(sql, [activityId], (error, activity) => {
    if (error) {
      console.log(error.message);

      return res.status(500).json({
        message: "There was a problem retrieving the activity."
      });
    }

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found."
      });
    }

    activity.studentFriendly =
      activity.studentFriendly === 1;

    activity.accessible =
      activity.accessible === 1;

    activity.featured =
      activity.featured === 1;

    res.json({ activity });
  });
});


app.post("/api/activities", (req, res) => {
  const activity = req.body;

  if (
    !activity.name ||
    !activity.county ||
    !activity.city ||
    !activity.category ||
    !activity.description ||
    !activity.priceType ||
    activity.price === undefined ||
    !activity.durationMinutes ||
    !activity.environment ||
    !activity.rating
  ) {
    return res.status(400).json({
      message: "Please complete all required fields."
    });
  }

  if (activity.rating < 1 || activity.rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5."
    });
  }

  if (activity.price < 0) {
    return res.status(400).json({
      message: "Price cannot be negative."
    });
  }

  const sql = `
    INSERT INTO activities (
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
  ];

  db.run(sql, values, function (error) {
    if (error) {
      console.log(error.message);

      return res.status(500).json({
        message: "There was a problem adding the activity."
      });
    }

    res.status(201).json({
      message: "Activity added successfully.",
      activityId: this.lastID
    });
  });
});


app.put("/api/activities/:id", (req, res) => {
  const activityId = req.params.id;
  const activity = req.body;

  if (
    !activity.name ||
    !activity.county ||
    !activity.city ||
    !activity.category ||
    !activity.description ||
    !activity.priceType ||
    activity.price === undefined ||
    !activity.durationMinutes ||
    !activity.environment ||
    !activity.rating
  ) {
    return res.status(400).json({
      message: "Please complete all required fields."
    });
  }

  if (activity.rating < 1 || activity.rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5."
    });
  }

  if (activity.price < 0) {
    return res.status(400).json({
      message: "Price cannot be negative."
    });
  }

  const sql = `
    UPDATE activities
    SET
      name = ?,
      county = ?,
      city = ?,
      category = ?,
      description = ?,
      priceType = ?,
      price = ?,
      durationMinutes = ?,
      environment = ?,
      rating = ?,
      studentFriendly = ?,
      accessible = ?,
      featured = ?
    WHERE id = ?
  `;

  const values = [
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
    activity.featured ? 1 : 0,
    activityId
  ];

  db.run(sql, values, function (error) {
    if (error) {
      console.log(error.message);

      return res.status(500).json({
        message: "There was a problem updating the activity."
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Activity not found."
      });
    }

    res.json({
      message: "Activity updated successfully."
    });
  });
});

app.delete("/api/activities/:id", (req, res) => {
  const activityId = req.params.id;

  const sql = "DELETE FROM activities WHERE id = ?";

  db.run(sql, [activityId], function (error) {
    if (error) {
      console.log(error.message);

      return res.status(500).json({
        message: "There was a problem deleting the activity."
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Activity not found."
      });
    }

    res.json({
      message: "Activity deleted successfully."
    });
  });
});

app.listen(port, () => {
  console.log(
    `ExploreÉire is running at http://localhost:${port}`
  );
});