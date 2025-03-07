const API_KEY = "o8DHRoh8grX4dxx5Q-U5pERFaMsqugx-URmAZIY5yLQ";
const API_URL = "https://api.unsplash.com/search/photos";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const imageGallery = document.getElementById("image-gallery");
const favoritesGallery = document.getElementById("favorites-gallery");
const showMoreButton = document.getElementById("show-more-button");
const loader = document.getElementById("loader");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalDownload = document.getElementById("modal-download");
const closeModal = document.querySelector(".close-modal");

let currentPage = 1;
let currentQuery = "";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

showMoreButton.style.display = "none";

searchButton.addEventListener("click", initiateSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    initiateSearch();
  }
});
showMoreButton.addEventListener("click", loadMoreImages);
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

displayFavorites();

function initiateSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    alert("Please enter a search term");
    return;
  }

  currentQuery = query;
  currentPage = 1;
  imageGallery.innerHTML = "";
  showMoreButton.style.display = "none";

  fetchImages(query, currentPage);
}

async function fetchImages(query, page) {
  try {
    loader.style.display = "flex";

    const response = await fetch(
      `${API_URL}?query=${query}&page=${page}&per_page=10&client_id=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    loader.style.display = "none";

    displayImages(data.results);

    if (data.total_pages > page) {
      showMoreButton.style.display = "block";
    } else {
      showMoreButton.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    loader.style.display = "none";
    alert("Error fetching images. Please try again.");
  }
}

function loadMoreImages() {
  currentPage++;
  fetchImages(currentQuery, currentPage);
}

function displayImages(images) {
  images.forEach((image) => {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";

    const isFavorite = favorites.some((fav) => fav.id === image.id);

    imageCard.innerHTML = `
            <img src="${image.urls.small}" alt="${
      image.alt_description || "Unsplash image"
    }" />
            <div class="image-info">
                <span class="photographer">Photo by ${image.user.name}</span>
                <button class="favorite-btn ${
                  isFavorite ? "active" : ""
                }" data-id="${image.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;

    imageCard.querySelector("img").addEventListener("click", () => {
      openImageModal(image);
    });

    imageCard.querySelector(".favorite-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(image);
      e.currentTarget.classList.toggle("active");
    });

    imageGallery.appendChild(imageCard);
  });

  const newCards = document.querySelectorAll(".image-card:not(.animated)");
  newCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animated");
      card.style.animation = "fadeIn 0.5s ease forwards";
    }, index * 100);
  });
}

function openImageModal(image) {
  modalImg.src = image.urls.regular;
  modalTitle.textContent = image.alt_description || "Untitled Image";
  modalAuthor.textContent = `Photographer: ${image.user.name}`;
  modalDownload.href = image.urls.full;
  modal.style.display = "block";
}

function toggleFavorite(image) {
  const index = favorites.findIndex((fav) => fav.id === image.id);

  if (index === -1) {
    const favoriteImage = {
      id: image.id,
      urls: {
        small: image.urls.small,
        regular: image.urls.regular,
        full: image.urls.full,
      },
      alt_description: image.alt_description,
      user: {
        name: image.user.name,
      },
    };

    favorites.push(favoriteImage);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  displayFavorites();
}

function displayFavorites() {
  favoritesGallery.innerHTML = "";

  if (favorites.length === 0) {
    favoritesGallery.innerHTML =
      '<p class="no-favorites">No favorite images yet. Click the heart icon to add favorites.</p>';
    return;
  }

  favorites.forEach((image) => {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";

    imageCard.innerHTML = `
            <img src="${image.urls.small}" alt="${
      image.alt_description || "Favorite image"
    }" />
            <div class="image-info">
                <span class="photographer">Photo by ${image.user.name}</span>
                <button class="favorite-btn active" data-id="${image.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;

    imageCard.querySelector("img").addEventListener("click", () => {
      openImageModal(image);
    });
    // Add click event to favorite button
    imageCard.querySelector(".favorite-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(image);

      imageCard.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => {
        imageCard.remove();
      }, 300);
    });

    favoritesGallery.appendChild(imageCard);
  });
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(20px);
    }
}
`;
document.head.appendChild(styleSheet);
