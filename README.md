# ExploreÉire

An Irish activity planner for international students, built as an academic web development project.

The application connects a JavaScript frontend to a Node.js and Express API, with activity records stored in SQLite.

## Features

- Browse activities and view individual activity details.
- Add, edit and delete activities.
- Validate required fields, prices and ratings.
- View a dashboard showing activity totals, free activities, average ratings and county coverage.
- Explore charts grouped by category, price, environment and county.

## Technologies

HTML, CSS, JavaScript, Node.js, Express, SQLite and Chart.js.

## Run locally

Install Node.js and npm, then download or clone this repository.

Open a terminal in the project folder and install the dependencies:

```bash
npm install
```

Set up the database:

```bash
node database/setupDatabase.js
```

Start the server:

```bash
node server.js
```

Open http://localhost:3000 in your browser.

The dashboard loads Chart.js from an external source, so an internet connection is needed for the charts.

## Project structure

- `public/`: HTML pages, styles and frontend JavaScript.
- `server.js`: Express server and activity API endpoints.
- `database/`: SQLite database connection and setup script.
- `data/activities.json`: initial activity data.

## Scope

This is an academic demonstration intended to run locally. The API does not include authentication, so it should not be exposed as a public service without further security work.
