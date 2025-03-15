const form = document.querySelector("#form");
const inputs = document.querySelectorAll("#form input");
const errorMessages = document.querySelectorAll(".error-message");
const cardContainer = document.querySelector("#card-container");
let userData = JSON.parse(localStorage.getItem("userData")) || [];
const userObj = {};

inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    userObj[e.currentTarget.id] = e.currentTarget.value.trim();
    validateInput(input, index);
  });
});

function validateInput(input, index) {
  let errorMessage = "";
  let value = input.value.trim();
  let id = input.id;

  if (id === "firstName" || id === "lastName") {
    if (!value || !/^[a-zA-Z\s]+$/.test(value)) {
      errorMessage = "Must contain only letters.";
    }
  }

  if (id === "phone") {
    if (!value || !/^\d{10,15}$/.test(value)) {
      errorMessage = "Phone number must be 10-15 digits.";
    }
  }

  if (id === "country" || id === "state") {
    if (!value) {
      errorMessage = "This field is required.";
    }
  }

  errorMessages[index].textContent = errorMessage;
  input.classList.toggle("border-red-500", errorMessage !== "");
  return !errorMessage;
}

// Validate entire form
function validateForm() {
  let isValid = true;
  inputs.forEach((input, index) => {
    if (!validateInput(input, index)) {
      isValid = false;
    }
  });
  return isValid;
}

// Display user cards
function renderUserCards() {
  cardContainer.innerHTML = ""; // Clear existing cards
  userData.forEach((user) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div
        class="border border-gray-100 p-6 rounded-xl w-64 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
      >
        <div class="flex items-center justify-center mb-4">
          <div
            class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl"
          >
            <span>${
              user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"
            }</span>
          </div>
        </div>
        <h2 class="text-xl font-bold text-center mb-2">${
          user.firstName || "Unknown"
        } ${user.lastName || ""}</h2>
        <div class="text-sm text-gray-100 space-y-1">
          <p class="flex items-center">
            <i class="fas fa-globe mr-2"></i>
            <span>Country: ${user.country || "N/A"}</span>
          </p>
          <p class="flex items-center">
            <i class="fas fa-phone mr-2"></i>
            <span>Phone: ${user.phone || "N/A"}</span>
          </p>
          <p class="flex items-center">
            <i class="fas fa-map-marker-alt mr-2"></i>
            <span>State: ${user.state || "N/A"}</span>
          </p>
        </div>
      </div>
    `;
    cardContainer.appendChild(card);
  });
}

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  userData.push({ ...userObj });
  localStorage.setItem("userData", JSON.stringify(userData));

  form.reset();
  errorMessages.forEach((msg) => (msg.textContent = ""));
  inputs.forEach((input) => input.classList.remove("border-red-500"));

  renderUserCards(); // Update UI
});

renderUserCards();
