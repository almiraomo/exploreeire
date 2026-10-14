const totalActivities = document.getElementById("total-activities");
const freeActivities = document.getElementById("free-activities");
const averageRating = document.getElementById("average-rating");
const countyCount = document.getElementById("county-count");
const highestRated = document.getElementById("highest-rated");

fetch("/api/activities")
  .then((response) => response.json())
  .then((data) => {
    const activities = data.activities;

    showStatistics(activities);
    createCategoryChart(activities);
    createPriceChart(activities);
    createEnvironmentChart(activities);
    createCountyChart(activities);
  })
  .catch((error) => {
    console.log("Dashboard data could not be loaded.", error);
  });

function showStatistics(activities) {
  totalActivities.textContent = activities.length;

  if (activities.length === 0) {
    freeActivities.textContent = "0";
    averageRating.textContent = "0";
    countyCount.textContent = "0";
    highestRated.textContent = "No activities";
    return;
  }

  const freeList = activities.filter((activity) => {
    return Number(activity.price) === 0;
  });

  freeActivities.textContent = freeList.length;

  let ratingTotal = 0;

  activities.forEach((activity) => {
    ratingTotal += Number(activity.rating);
  });

  const ratingAverage = ratingTotal / activities.length;

  averageRating.textContent = ratingAverage.toFixed(1);

  const counties = activities.map((activity) => {
    return activity.county;
  });

  const uniqueCounties = new Set(counties);

  countyCount.textContent = uniqueCounties.size;

  let topActivity = activities[0];

  activities.forEach((activity) => {
    if (Number(activity.rating) > Number(topActivity.rating)) {
      topActivity = activity;
    }
  });

  highestRated.textContent =
    `${topActivity.name} (${Number(topActivity.rating).toFixed(1)})`;
}

function countValues(activities, propertyName) {
  const totals = {};

  activities.forEach((activity) => {
    const value = activity[propertyName];

    if (totals[value]) {
      totals[value] = totals[value] + 1;
    } else {
      totals[value] = 1;
    }
  });

  return totals;
}

function createCategoryChart(activities) {
  const categoryTotals = countValues(activities, "category");

  new Chart(document.getElementById("category-chart"), {
    type: "bar",

    data: {
      labels: Object.keys(categoryTotals),

      datasets: [
        {
          label: "Number of activities",
          data: Object.values(categoryTotals),

          backgroundColor: [
            "#245c4f",
            "#4f8f7f",
            "#d4a84b",
            "#9bbf9b",
            "#8a6d3b"
          ]
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function createPriceChart(activities) {
  let freeTotal = 0;
  let paidTotal = 0;

  activities.forEach((activity) => {
    if (Number(activity.price) === 0) {
      freeTotal = freeTotal + 1;
    } else {
      paidTotal = paidTotal + 1;
    }
  });

  new Chart(document.getElementById("price-chart"), {
    type: "doughnut",

    data: {
      labels: ["Free", "Paid"],

      datasets: [
        {
          data: [freeTotal, paidTotal],

          backgroundColor: [
            "#4f8f7f",
            "#d4a84b"
          ]
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function createEnvironmentChart(activities) {
  const environmentTotals = countValues(activities, "environment");

  new Chart(document.getElementById("environment-chart"), {
    type: "pie",

    data: {
      labels: Object.keys(environmentTotals),

      datasets: [
        {
          data: Object.values(environmentTotals),

          backgroundColor: [
            "#245c4f",
            "#78a896",
            "#d4a84b"
          ]
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function createCountyChart(activities) {
  const countyTotals = countValues(activities, "county");

  new Chart(document.getElementById("county-chart"), {
    type: "bar",

    data: {
      labels: Object.keys(countyTotals),

      datasets: [
        {
          label: "Number of activities",
          data: Object.values(countyTotals),

          backgroundColor: [
            "#245c4f",
            "#4f8f7f",
            "#78a896",
            "#d4a84b",
            "#9bbf9b"
          ]
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}