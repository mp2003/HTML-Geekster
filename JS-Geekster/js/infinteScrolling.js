const access_Key = "BEcX9kJ6l0cS58HFjnYwGQCB7m2CrjOaQEKQqtQmZE8";
const imageContainer = document.querySelector(".img-container");

let page = 1;
const perPage = 12;
let loading = false;

// Function to fetch images
const fetchImages = async (page, perPage) => {
  if (loading) return;
  loading = true;

  // Show loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.id = "loading-indicator";
  loadingIndicator.textContent = "Loading...";
  loadingIndicator.className =
    "w-full text-center py-4 text-black font-bold text-3xl";
  imageContainer.appendChild(loadingIndicator);

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${page}&per_page=${perPage}&client_id=${access_Key}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Unsplash API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // If we got fewer items than requested, assume we've reached the end
    if (data.length === 0) {
      const endMessage = document.createElement("div");
      endMessage.textContent = "No more images to load";
      endMessage.className = "w-full text-center py-4 text-gray-500";
      imageContainer.appendChild(endMessage);
    }

    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    const errorMessage = document.createElement("div");
    errorMessage.textContent = `Error loading images: ${error.message}`;
    errorMessage.className = "w-full text-center py-4 text-red-500";
    imageContainer.appendChild(errorMessage);
    return [];
  } finally {
    // Remove loading indicator
    const indicator = document.getElementById("loading-indicator");
    if (indicator) indicator.remove();

    loading = false;
  }
};

// Function to display images
const displayImage = (image) => {
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("relative", "group", "mb-6");

  imgWrapper.innerHTML = `
    <img
      src="${image.urls.regular}"
      alt="${image.alt_description || "Unsplash image"}"
      class="h-[400px] w-full object-cover rounded-xl shadow-lg border-4 border-black transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl"
      loading="lazy"
    />`;

  imageContainer.appendChild(imgWrapper);
};

// Function to handle scroll with debounce
const debounce = (func, delay) => {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
};

// Improved scroll handler with better threshold calculation
const handleScroll = debounce(() => {
  if (loading) return;

  const scrollY = window.scrollY ;
  const viewportHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  // Load more when user has scrolled to 80% of the page
  const scrollThreshold = docHeight - viewportHeight - viewportHeight * 0.2;

  if (scrollY >= scrollThreshold) {
    page++;
    fetchImages(page, perPage).then((data) => {
      if (data && data.length > 0) {
        data.forEach((image) => displayImage(image));
      }
    });
  }
}, 500);

// Load initial images
window.addEventListener("DOMContentLoaded", () => {
  fetchImages(page, perPage).then((data) => {
    if (data && data.length > 0) {
      data.forEach((image) => displayImage(image));
    }
  });
});

// Add scroll event listener
window.addEventListener("scroll", handleScroll);
