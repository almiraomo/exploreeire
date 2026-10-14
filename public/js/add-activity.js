const activityForm = document.getElementById("activity-form");
const formMessage = document.getElementById("form-message");

activityForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const activity = {
    name: document.getElementById("name").value.trim(),
    county: document.getElementById("county").value.trim(),
    city: document.getElementById("city").value.trim(),
    category: document.getElementById("category").value,
    description: document.getElementById("description").value.trim(),
    priceType: document.getElementById("price-type").value,
    price: Number(document.getElementById("price").value),
    durationMinutes: Number(document.getElementById("duration").value),
    environment: document.getElementById("environment").value,
    rating: Number(document.getElementById("rating").value),
    studentFriendly:
      document.getElementById("student-friendly").checked,
    accessible: document.getElementById("accessible").checked,
    featured: document.getElementById("featured").checked
  };

  try {
    const response = await fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(activity)
    });

    const result = await response.json();

    formMessage.textContent = result.message;

    if (response.ok) {
      activityForm.reset();
    }
  } catch (error) {
    formMessage.textContent =
      "There was a problem sending the activity.";

    console.log(error);
  }
});