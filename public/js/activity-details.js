const detailsContainer = document.getElementById("activity-details");

const pageUrl = new URLSearchParams(window.location.search);
const activityId = pageUrl.get("id");

if (!activityId) {
  detailsContainer.innerHTML = `
    <h2>Activity not found</h2>
    <p>No activity ID was provided.</p>
    <a href="/activities.html" class="primary-button">
      Back to activities
    </a>
  `;
} else {
  loadActivity();
}

function loadActivity() {
  fetch(`/api/activities/${activityId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Activity not found");
      }

      return response.json();
    })
    .then((data) => {
      showActivity(data.activity);
    })
    .catch((error) => {
      console.log(error);

      detailsContainer.innerHTML = `
        <h2>Activity not found</h2>
        <p>The activity could not be loaded.</p>
        <a href="/activities.html" class="primary-button">
          Back to activities
        </a>
      `;
    });
}

function showActivity(activity) {
  const priceText =
    Number(activity.price) === 0
      ? "Free"
      : `€${Number(activity.price).toFixed(2)}`;

  detailsContainer.innerHTML = `
    <p class="details-label">${activity.category}</p>

    <h2>${activity.name}</h2>

    <p class="details-description">
      ${activity.description}
    </p>

    <div class="details-information">

      <div class="details-item">
        <h3>County</h3>
        <p>${activity.county}</p>
      </div>

      <div class="details-item">
        <h3>Price</h3>
        <p>${priceText}</p>
      </div>

      <div class="details-item">
        <h3>Rating</h3>
        <p>${Number(activity.rating).toFixed(1)} / 5</p>
      </div>

      <div class="details-item">
        <h3>Duration</h3>
        <p>${activity.duration}</p>
      </div>

      <div class="details-item">
        <h3>Environment</h3>
        <p>${activity.environment}</p>
      </div>

      <div class="details-item">
        <h3>Category</h3>
        <p>${activity.category}</p>
      </div>

    </div>

    <div class="details-buttons">
      <a
        href="/edit-activity.html?id=${activity.id}"
        class="primary-button"
      >
        Edit activity
      </a>

      <a
        href="/activities.html"
        class="secondary-button"
      >
        Back to activities
      </a>
    </div>
  `;
}