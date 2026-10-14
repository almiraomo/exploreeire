const editForm = document.getElementById("edit-activity-form");
const editMessage = document.getElementById("edit-message");

const pageParameters = new URLSearchParams(window.location.search);
const activityId = pageParameters.get("id");

async function loadActivity() {
  try {
    const response = await fetch(`/api/activities/${activityId}`);
    const data = await response.json();

    if (!response.ok) {
      editMessage.textContent = data.message;
      return;
    }

    const activity = data.activity;

    document.getElementById("edit-name").value = activity.name;
    document.getElementById("edit-county").value = activity.county;
    document.getElementById("edit-city").value = activity.city;
    document.getElementById("edit-category").value = activity.category;
    document.getElementById("edit-description").value =
      activity.description;
    document.getElementById("edit-price-type").value =
      activity.priceType;
    document.getElementById("edit-price").value = activity.price;
    document.getElementById("edit-duration").value =
      activity.durationMinutes;
    document.getElementById("edit-environment").value =
      activity.environment;
    document.getElementById("edit-rating").value = activity.rating;
    document.getElementById("edit-student-friendly").checked =
      activity.studentFriendly;
    document.getElementById("edit-accessible").checked =
      activity.accessible;
    document.getElementById("edit-featured").checked =
      activity.featured;
  } catch (error) {
    editMessage.textContent =
      "There was a problem loading the activity.";

    console.log(error);
  }
}

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const updatedActivity = {
    name: document.getElementById("edit-name").value.trim(),
    county: document.getElementById("edit-county").value.trim(),
    city: document.getElementById("edit-city").value.trim(),
    category: document.getElementById("edit-category").value,
    description:
      document.getElementById("edit-description").value.trim(),
    priceType:
      document.getElementById("edit-price-type").value,
    price: Number(document.getElementById("edit-price").value),
    durationMinutes: Number(
      document.getElementById("edit-duration").value
    ),
    environment:
      document.getElementById("edit-environment").value,
    rating: Number(document.getElementById("edit-rating").value),
    studentFriendly:
      document.getElementById("edit-student-friendly").checked,
    accessible:
      document.getElementById("edit-accessible").checked,
    featured:
      document.getElementById("edit-featured").checked
  };

  try {
    const response = await fetch(`/api/activities/${activityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedActivity)
    });

    const result = await response.json();

    editMessage.textContent = result.message;

    if (response.ok) {
      setTimeout(() => {
        window.location.href = "activities.html";
      }, 1000);
    }
  } catch (error) {
    editMessage.textContent =
      "There was a problem updating the activity.";

    console.log(error);
  }
});

if (activityId) {
  loadActivity();
} else {
  editMessage.textContent =
    "No activity was selected. Please return to the Explore page.";
}