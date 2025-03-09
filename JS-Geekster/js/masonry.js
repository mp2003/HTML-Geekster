// Enhanced version of your existing JavaScript
let loadedPhones = [];

const masonryContainer = document.querySelector(".masonry-container");
const exploreButton = document.querySelector(".masonry-explore-btn");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");

const DEFAULT_SEARCH_TERM = "samsung";
const ITEM_SIZES = ["small", "medium", "large"];
const ANIMATION_DELAY_INCREMENT = 0.1;

// Added fallback image URL
const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x800/1a1a1a/ffffff?text=Phone+Not+Available";

// Using reliable image sources (placeholder images for demonstration)
const phoneImages = [
  "https://via.placeholder.com/600x800/333/fff?text=Phone+1",
  "https://via.placeholder.com/600x800/444/fff?text=Phone+2",
  "https://via.placeholder.com/600x800/555/fff?text=Phone+3",
  "https://via.placeholder.com/600x800/666/fff?text=Phone+4",
  "https://via.placeholder.com/600x800/777/fff?text=Phone+5",
  "https://via.placeholder.com/600x800/888/fff?text=Phone+6",
  "https://via.placeholder.com/600x800/999/fff?text=Phone+7",
  "https://via.placeholder.com/600x800/aaa/fff?text=Phone+8",
  "https://via.placeholder.com/600x800/bbb/fff?text=Phone+9",
  "https://via.placeholder.com/600x800/ccc/fff?text=Phone+10",
  "https://via.placeholder.com/600x800/ddd/fff?text=Phone+11",
  "https://via.placeholder.com/600x800/eee/fff?text=Phone+12",
  "https://via.placeholder.com/600x800/123/fff?text=Phone+13",
  "https://via.placeholder.com/600x800/234/fff?text=Phone+14",
  "https://via.placeholder.com/600x800/345/fff?text=Phone+15",
  "https://via.placeholder.com/600x800/456/fff?text=Phone+16",
  "https://via.placeholder.com/600x800/567/fff?text=Phone+17",
  "https://via.placeholder.com/600x800/678/fff?text=Phone+18",
  "https://via.placeholder.com/600x800/789/fff?text=Phone+19",
  "https://via.placeholder.com/600x800/890/fff?text=Phone+20",
];

const phoneModels = [
  {
    id: "samsung-galaxy-s21",
    name: "Galaxy S21",
    brand: "Samsung",
    price: "$799",
    rating: 4.7,
    features: ["5G", "8GB RAM", "128GB Storage"],
  },
  {
    id: "apple-iphone-13",
    name: "iPhone 13",
    brand: "Apple",
    price: "$799",
    rating: 4.8,
    features: ["A15 Bionic", "6GB RAM", "128GB Storage"],
  },
  // Rest of the phone models...
  {
    id: "samsung-galaxy-a52",
    name: "Galaxy A52",
    brand: "Samsung",
    price: "$399",
    rating: 4.3,
    features: ["5G", "6GB RAM", "128GB Storage"],
  },
];

// Enhanced phone fetching with additional details
const fetchPhones = async (searchItem) => {
  loadedPhones = [];

  const filteredPhones = phoneModels.filter(
    (phone) =>
      phone.name.toLowerCase().includes(searchItem.toLowerCase()) ||
      phone.brand.toLowerCase().includes(searchItem.toLowerCase())
  );

  filteredPhones.forEach((phone, index) => {
    loadedPhones.push({
      id: phone.id,
      name: phone.name,
      brand: phone.brand,
      image: phoneImages[index % phoneImages.length],
      fallbackImage: FALLBACK_IMAGE,
      price: phone.price,
      description: `${phone.name} by ${phone.brand}`,
      rating: phone.rating || 4.0,
      features: phone.features || ["Premium Build", "High Performance"],
    });
  });

  return loadedPhones;
};

// Enhanced masonry item creation with better UI components and error handling
const createMasonryItem = (phone, index) => {
  const item = document.createElement("div");
  item.className = `masonry-item ${ITEM_SIZES[index % ITEM_SIZES.length]}`;
  if (index % 7 === 0) item.classList.add("featured");
  if (index % 11 === 0) item.classList.add("new");

  item.style.transitionDelay = `${index * ANIMATION_DELAY_INCREMENT}s`;

  // Create rating stars
  const ratingStars = generateRatingStars(phone.rating);

  // Format features as list
  const featureList = phone.features
    ? `<div class="masonry-features">
       ${phone.features
         .map((feature) => `<span class="feature-tag">${feature}</span>`)
         .join("")}
     </div>`
    : "";

  item.innerHTML = `
    <div class="masonry-card" data-id="${phone.id}">
      <div class="masonry-img-container">
        <img 
          src="${FALLBACK_IMAGE}" 
          data-src="${phone.image}" 
          alt="${phone.name}" 
          class="masonry-img loading"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        >
        <div class="loading-indicator"></div>
      </div>
      <div class="masonry-brand">${phone.brand}</div>
      <div class="masonry-overlay">
        <h3 class="masonry-title">${phone.name}</h3>
        <div class="masonry-rating">${ratingStars}</div>
        <p class="masonry-desc">${phone.description}</p>
        ${featureList}
        <p class="masonry-price">${phone.price}</p>
        <button class="view-details-btn">View Details</button>
      </div>
    </div>
  `;

  // Add click event listener
  item.querySelector(".view-details-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    viewPhoneDetails(phone.id);
  });

  item.addEventListener("click", () => {
    viewPhoneDetails(phone.id);
  });

  return item;
};

// Generate star ratings
const generateRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHTML = "";

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star full">★</span>';
  }

  // Half star if needed
  if (halfStar) {
    starsHTML += '<span class="star half">★</span>';
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star empty">☆</span>';
  }

  return starsHTML;
};

// Enhanced populate masonry with loading state
const populateMasonry = (phones) => {
  // Show loading state
  masonryContainer.innerHTML =
    '<div class="loading-state"><div class="loading-spinner"></div><p>Loading phones...</p></div>';

  if (!phones || phones.length === 0) {
    masonryContainer.innerHTML =
      '<div class="no-results"><p>No phones found. Try a different search term.</p><img src="' +
      FALLBACK_IMAGE +
      '" alt="No results" class="no-results-img"></div>';
    return;
  }

  // Clear loading state before adding items
  setTimeout(() => {
    masonryContainer.innerHTML = "";

    phones.forEach((phone, index) => {
      const item = createMasonryItem(phone, index);
      masonryContainer.appendChild(item);
    });

    setTimeout(() => {
      resizeMasonryItems();
    }, 100);

    setTimeout(() => {
      document.querySelectorAll(".masonry-item").forEach((item) => {
        item.classList.add("visible");
      });

      lazyLoadImages();
    }, 300);
  }, 600); // Simulated loading time
};

// Enhanced lazy loading with better error handling
const lazyLoadImages = () => {
  const masonryImages = document.querySelectorAll(".masonry-img.loading");

  // Use intersection observer for better performance
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const dataSrc = img.getAttribute("data-src");

          setTimeout(() => {
            // Set image source with proper error handling
            img.onerror = function () {
              console.warn(`Failed to load image: ${dataSrc}`);
              img.src = FALLBACK_IMAGE;
              img.classList.remove("loading");
            };

            img.onload = function () {
              img.classList.remove("loading");
            };

            img.setAttribute("src", dataSrc);
            imageObserver.unobserve(img);
          }, Math.random() * 400 + 100); // Randomized load for visual effect
        }
      });
    },
    {
      rootMargin: "200px 0px",
      threshold: 0.1,
    }
  );

  masonryImages.forEach((img) => {
    imageObserver.observe(img);
  });
};

// Enhanced resizing function for better grid layout
const resizeMasonryItems = () => {
  const grid = document.querySelector(".masonry-container");
  if (!grid) return;

  const rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  );
  const rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
  );

  const items = document.querySelectorAll(".masonry-item");

  items.forEach((item) => {
    const content = item.querySelector(".masonry-card");
    if (!content) return;

    const contentHeight = content.getBoundingClientRect().height;
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  });
};

// Enhanced phone details view with modal
const viewPhoneDetails = async (phoneId) => {
  try {
    const selectedPhone = loadedPhones.find((phone) => phone.id === phoneId);
    if (!selectedPhone) throw new Error("Phone not found");

    // Create modal for better UI
    const modal = document.createElement("div");
    modal.className = "phone-detail-modal";

    // Format features list
    const featuresList = selectedPhone.features
      ? `<ul class="detail-features-list">
         ${selectedPhone.features
           .map((feature) => `<li>${feature}</li>`)
           .join("")}
       </ul>`
      : "";

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-header">
          <h2>${selectedPhone.name}</h2>
          <div class="modal-brand">${selectedPhone.brand}</div>
        </div>
        <div class="modal-body">
          <div class="modal-image">
            <img src="${selectedPhone.image}" alt="${selectedPhone.name}" 
                 onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';">
          </div>
          <div class="modal-info">
            <div class="detail-rating">${generateRatingStars(
              selectedPhone.rating
            )}</div>
            <div class="detail-price">${selectedPhone.price}</div>
            <div class="detail-description">${selectedPhone.description}</div>
            <div class="detail-features">
              <h3>Key Features</h3>
              ${featuresList}
            </div>
            <button class="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add("active");
    }, 10);

    // Close modal handler
    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.remove();
      }, 300);
    });

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        setTimeout(() => {
          modal.remove();
        }, 300);
      }
    });
  } catch (error) {
    console.error("Error displaying phone details:", error);
    alert(
      "Sorry, we couldn't load the details for this phone. Please try again later."
    );
  }
};

// Initialize search filters
const initFilters = () => {
  const filterContainer = document.createElement("div");
  filterContainer.className = "masonry-filters";
  filterContainer.innerHTML = `
    <div class="filter-wrap">
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Search by brand or model...">
        <button id="search-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      <div class="brand-filters">
        <button class="brand-filter active" data-brand="all">All</button>
        <button class="brand-filter" data-brand="samsung">Samsung</button>
        <button class="brand-filter" data-brand="apple">Apple</button>
        <button class="brand-filter" data-brand="google">Google</button>
      </div>
    </div>
  `;

  // Insert filter before the masonry container
  const masonryHeader = document.querySelector(".masonry-header");
  masonryHeader.parentNode.insertBefore(
    filterContainer,
    masonryHeader.nextSibling
  );

  // Set up brand filter handlers
  document.querySelectorAll(".brand-filter").forEach((btn) => {
    btn.addEventListener("click", async () => {
      // Update active button
      document
        .querySelectorAll(".brand-filter")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const brand = btn.getAttribute("data-brand");
      if (brand === "all") {
        await fetchPhones("");
      } else {
        await fetchPhones(brand);
      }
      populateMasonry(loadedPhones);
    });
  });
};

// Initialize masonry layout with enhanced features
const initMasonry = async () => {
  // Add filters to the UI
  initFilters();

  // Initial data load
  await fetchPhones(DEFAULT_SEARCH_TERM);
  populateMasonry(loadedPhones);

  // Set up resize handler with debounce for better performance
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeMasonryItems();
    }, 100);
  });

  // Set up search button
  const searchButton = document.getElementById("search-btn");
  searchButton.addEventListener("click", async () => {
    const searchTerm = document.getElementById("search-input").value.trim();
    if (searchTerm) {
      await fetchPhones(searchTerm);
      populateMasonry(loadedPhones);
    }
  });

  // Set up search input
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        await fetchPhones(searchTerm);
        populateMasonry(loadedPhones);
      }
    }
  });

  // Set up explore button
  if (exploreButton) {
    exploreButton.addEventListener("click", () => {
      const allPhonesSection =
        document.querySelector(".masonry-filters") ||
        document.querySelector(".masonry-container");
      if (allPhonesSection) {
        allPhonesSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  }
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initMasonry);
