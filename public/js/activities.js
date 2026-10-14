const activityContainer = document.getElementById("activity-container");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const countyFilter = document.getElementById("county-filter");

let allActivities = [];

fetch("/api/activities")
  .then((response) => response.json())
  .then((data) => {
    allActivities = data.activities;

    fillFilters(allActivities);
    displayActivities(allActivities);
  })
  .catch((error) => {
    console.log(error);

    activityContainer.innerHTML = `
      <p>There was a problem loading the activities.</p>
    `;
  });

function displayActivities(activities) {
  activityContainer.innerHTML = "";

  if (activities.length === 0) {
    activityContainer.innerHTML = `
      <p>No activities match your search.</p>
    `;

    return;
  }

  activities.forEach((activity) => {
    const activityCard = document.createElement("article");

    activityCard.classList.add("activity-card");

    const priceText =
      Number(activity.price) === 0
        ? "Free"
        : `€${Number(activity.price).toFixed(2)}`;

    activityCard.innerHTML = `
      <h2>${activity.name}</h2>

      <p class="activity-location">
        ${activity.county} · ${activity.category}
      </p>

      <p>${activity.description}</p>

      <div class="activity-information">
        <span>${priceText}</span>
        <span>${activity.duration}</span>
        <span>${Number(activity.rating).toFixed(1)} / 5</span>
      </div>

      <div class="activity-buttons">

        <a
          href="/activity-details.html?id=${activity.id}"
          class="view-button"
        >
          View details
        </a>

        <a
          href="/edit-activity.html?id=${activity.id}"
          class="edit-button"
        >
          Edit activity
        </a>

        <button
          type="button"
          class="delete-button"
          data-id="${activity.id}"
        >
          Delete activity
        </button>

      </div>
    `;

    activityContainer.appendChild(activityCard);

    const deleteButton = activityCard.querySelector(".delete-button");

    deleteButton.addEventListener("click", function () {
      deleteActivity(activity.id, activity.name);
    });
  });
}

function fillFilters(activities) {
  const categories = activities.map((activity) => {
    return activity.category;
  });

  const counties = activities.map((activity) => {
    return activity.county;
  });

  const uniqueCategories = [...new Set(categories)];
  const uniqueCounties = [...new Set(counties)];

  uniqueCategories.sort();
  uniqueCounties.sort();

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);
  });

  uniqueCounties.forEach((county) => {
    const option = document.createElement("option");

    option.value = county;
    option.textContent = county;

    countyFilter.appendChild(option);
  });
}

function filterActivities() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedCounty = countyFilter.value;

  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchText) ||
      activity.county.toLowerCase().includes(searchText) ||
      activity.category.toLowerCase().includes(searchText) ||
      activity.description.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      activity.category === selectedCategory;

    const matchesCounty =
      selectedCounty === "all" ||
      activity.county === selectedCounty;

    return matchesSearch && matchesCategory && matchesCounty;
  });

  displayActivities(filteredActivities);
}

async function deleteActivity(activityId, activityName) {
  const confirmed = confirm(
    `Are you sure you want to delete ${activityName}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/activities/${activityId}`, {
      method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
      return;
    }

    alert(result.message);

    allActivities = allActivities.filter((activity) => {
      return activity.id !== activityId;
    });

    filterActivities();
  } catch (error) {
    console.log(error);
    alert("There was a problem deleting the activity.");
  }
}

searchInput.addEventListener("input", filterActivities);
categoryFilter.addEventListener("change", filterActivities);
countyFilter.addEventListener("change", filterActivities);