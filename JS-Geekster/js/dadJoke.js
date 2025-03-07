const jokeElement = document.getElementById("joke");
const jokeBtn = document.getElementById("btn");
const container = document.querySelector(".container");

const API_KEY = "OqUr+Kskr+/8v4mB17eUUA==EQtFecQtl4R1ZalX";
const API_URL = "https://api.api-ninjas.com/v1/dadjokes";

let currentFontSize = 1.3;
const MIN_FONT_SIZE = 0.8;
const MAX_FONT_SIZE = 2.0;
const FONT_SIZE_STEP = 0.1;

document.addEventListener("DOMContentLoaded", function () {
  setupUI();
  getJoke();
  jokeBtn.addEventListener("click", getJoke);
});

function setupUI() {
  const face = document.createElement("div");
  face.classList.add("face");
  face.textContent = "😂";
  container.insertBefore(face, container.firstChild);

  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  loadingDiv.style.display = "none";

  const loadingDots = document.createElement("div");
  loadingDots.classList.add("loading-dots");

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    loadingDots.appendChild(dot);
  }

  loadingDiv.appendChild(loadingDots);
  jokeElement.parentNode.insertBefore(loadingDiv, jokeElement);

  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent =
    "Oops! Dad went to get milk and couldn't find the jokes. Try again!";
  jokeElement.parentNode.insertBefore(errorMessage, jokeBtn);

  const controls = document.createElement("div");
  controls.classList.add("controls");

  const textSizeControl = document.createElement("div");
  textSizeControl.classList.add("text-size-control");

  const decreaseBtn = document.createElement("button");
  decreaseBtn.classList.add("text-size-btn");
  decreaseBtn.textContent = "A-";
  decreaseBtn.addEventListener("click", decreaseFontSize);

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("text-size-btn");
  increaseBtn.textContent = "A+";
  increaseBtn.addEventListener("click", increaseFontSize);

  textSizeControl.appendChild(decreaseBtn);
  textSizeControl.appendChild(increaseBtn);

  const toggleContainer = document.createElement("div");
  toggleContainer.classList.add("toggle-container");

  const darkModeLabel = document.createElement("span");
  darkModeLabel.textContent = "🌙";

  const toggleLabel = document.createElement("label");
  toggleLabel.classList.add("toggle");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", toggleDarkMode);

  const slider = document.createElement("span");
  slider.classList.add("slider");

  toggleLabel.appendChild(checkbox);
  toggleLabel.appendChild(slider);

  toggleContainer.appendChild(darkModeLabel);
  toggleContainer.appendChild(toggleLabel);

  controls.appendChild(textSizeControl);
  controls.appendChild(toggleContainer);

  container.appendChild(controls);

  const shareButtons = document.createElement("div");
  shareButtons.classList.add("share-buttons");

  const platforms = [
    { name: "facebook", icon: "f" },
    { name: "twitter", icon: "t" },
    { name: "whatsapp", icon: "w" },
  ];

  platforms.forEach((platform) => {
    const button = document.createElement("button");
    button.classList.add("share-btn", platform.name);
    button.textContent = platform.icon;
    button.addEventListener("click", () => shareJoke(platform.name));
    shareButtons.appendChild(button);
  });

  container.appendChild(shareButtons);
}

async function getJoke() {
  document.querySelector(".loading").style.display = "flex";
  jokeElement.style.display = "none";
  document.querySelector(".error-message").style.display = "none";

  try {
    if (!API_KEY) {
      throw new Error(
        "API key is required. Please sign up at api-ninjas.com to get your key."
      );
    }

    const response = await fetch(API_URL, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    document.querySelector(".loading").style.display = "none";
    jokeElement.style.display = "flex";

    jokeElement.classList.remove("animated");
    void jokeElement.offsetWidth;
    jokeElement.classList.add("animated");

    if (data && data.length > 0) {
      jokeElement.textContent = data[0].joke;
    } else {
      jokeElement.textContent =
        "Dad went out for milk, jokes will be back soon!";
    }
  } catch (error) {
    console.error("Error fetching joke:", error);

    document.querySelector(".loading").style.display = "none";
    document.querySelector(".error-message").style.display = "block";
    jokeElement.style.display = "flex";
    jokeElement.textContent = "Click the button to try again";
  }
}

function increaseFontSize() {
  if (currentFontSize < MAX_FONT_SIZE) {
    currentFontSize += FONT_SIZE_STEP;
    jokeElement.style.fontSize = `${currentFontSize}rem`;
  }
}

function decreaseFontSize() {
  if (currentFontSize > MIN_FONT_SIZE) {
    currentFontSize -= FONT_SIZE_STEP;
    jokeElement.style.fontSize = `${currentFontSize}rem`;
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function shareJoke(platform) {
  const jokeText = jokeElement.textContent;
  const encodedJoke = encodeURIComponent(jokeText);

  let shareUrl;

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedJoke}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedJoke}`;
      break;
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${encodedJoke}`;
      break;
    default:
      return;
  }

  window.open(shareUrl, "_blank");
}
