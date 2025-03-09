document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const showAllBtn = document.getElementById("show-all-btn");
  const phonesContainer = document.getElementById("phones-container");
  const resultsContainer = document.getElementById("results-container");
  const searchResults = document.getElementById("search-results");
  const allPhones = document.getElementById("all-phones");
  const phoneDetail = document.getElementById("phone-detail");
  const detailContainer = document.getElementById("detail-container");
  const backBtn = document.getElementById("back-btn");

  // Initial state
  let currentView = "all"; // 'all', 'search', or 'detail'
  const loadedPhones = [];
  const fetchPhones = async (searchItem) => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchItem}`;
    console.log(url);

    const response = await fetch(url);

    const data = await response.json();

    if (data.status) {
      for (let i = 0; i < data.data.length; i++) {
        let obj = data.data[i];
        loadedPhones.push({
          id: obj.slug,
          name: obj.phone_name,
          brand: obj.brand.trim(),
          image: obj.image,
          // We'll fetch detailed info when a obj is selected
          price: "Call for price",
          description: `${obj.phone_name} by ${obj.brand.trim()}`,
        });
      }
    } else {
      console.error("Error fetching phones:", data.message);
      return [];
    }
  };

  // Initialize the app
  initApp();

  // Event Listeners
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
  showAllBtn.addEventListener("click", showAllPhones);
  backBtn.addEventListener("click", goBack);

  // Functions
  async function initApp() {
    phonesContainer.innerHTML = '<div class="loading">Loading phones...</div>';

    try {
      await fetchPhones("oppo");
      // Display all phones on load
      displayPhones(loadedPhones, phonesContainer);
      searchResults.classList.add("hidden");
    } catch (error) {
      phonesContainer.innerHTML =
        '<div class="error">Failed to load phones. Please try again later.</div>';
      console.error("Error loading initial phones:", error);
    }
  }

  function displayPhones(phones, container) {
    container.innerHTML = "";

    if (phones.length === 0) {
      container.innerHTML =
        '<p class="no-results">No phones found matching your search criteria.</p>';
      return;
    }

    phones.forEach((phone) => {
      const phoneCard = createPhoneCard(phone);
      phoneCard.addEventListener("click", () => showPhoneDetail(phone));
      container.appendChild(phoneCard);
    });
  }

  function createPhoneCard(phone) {
    const card = document.createElement("div");
    card.className = "phone-card";
    card.dataset.id = phone.id;

    card.innerHTML = `
            <img src="${phone.image}" alt="${phone.name}" class="phone-img">
            <div class="phone-info">
                <h3 class="phone-name">${phone.name}</h3>
                <p class="phone-brand">${phone.brand}</p>
            </div>
        `;

    return card;
  }

  function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    console.log("handleSearch", searchTerm);

    if (searchTerm === "") {
      // If search is empty, show all currently loaded phones
      displayPhones(loadedPhones, phonesContainer);
      currentView = "all";
      updateView();
      return;
    }

    // Show loading indicator
    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
    searchResults.classList.remove("hidden");
    allPhones.classList.add("hidden");

    const filteredResult = loadedPhones.filter((phone) => {
      //   const isId = phone.id.split("_").some((str) => {
      //     //   console.log(str);
      //     return str.includes(searchTerm);
      //   });

      const isName = phone.name.toLowerCase().includes(searchTerm);
      return isName;
    });
    console.log(filteredResult);

    displayPhones(filteredResult, resultsContainer);
  }

  function showAllPhones() {
    searchInput.value = "";
    displayPhones(loadedPhones, phonesContainer);
    currentView = "all";
    updateView();
  }

  async function showPhoneDetail(phone) {
    // Show loading in detail view
    detailContainer.innerHTML =
      '<div class="loading">Loading phone details...</div>';
    phoneDetail.classList.remove("hidden");
    allPhones.classList.add("hidden");
    searchResults.classList.add("hidden");

    try {
      // Fetch detailed information for this phone
      const phoneDetails = await fetchPhoneDetails(phone.id);

      // Display the details
      detailContainer.innerHTML = createDetailHTML(phoneDetails);
      currentView = "detail";
      updateView();
    } catch (error) {
      detailContainer.innerHTML =
        '<div class="error">Failed to load phone details. Please try again later.</div>';
      console.error("Error loading phone details:", error);
    }
  }
  async function fetchPhoneDetails(slug) {
    try {
      const response = await fetch(
        `https://openapi.programming-hero.com/api/phone/${slug}`
      );
      const data = await response.json();

      if (data.status && data.data) {
        const phoneData = data.data;
        return {
          id: phoneData.slug,
          name: phoneData.name,
          brand: phoneData.brand,
          image: phoneData.image,
          price: phoneData.mainFeatures?.chipSet || "Call for price",
          os: phoneData.mainFeatures?.os || "Not specified",
          processor: phoneData.mainFeatures?.chipSet || "Not specified",
          ram: phoneData.mainFeatures?.memory || "Not specified",
          storage: phoneData.mainFeatures?.storage || "Not specified",
          camera:
            phoneData.mainFeatures?.sensors?.join(", ") || "Not specified",
          battery: phoneData.others?.battery || "Not specified",
          display: phoneData.mainFeatures?.displaySize || "Not specified",
          resolution: "Not specified",
          description:
            phoneData.releaseDate || `${phoneData.name} by ${phoneData.brand}`,
        };
      } else {
        throw new Error("Phone details not found");
      }
    } catch (error) {
      console.error("Error fetching phone details:", error);
      throw error;
    }
  }
  function createDetailHTML(phone) {
    console.log(phone);

    return `
            <div class="detail-content">
                <div class="detail-img-container">
                    <img src="${phone.image}" alt="${phone.name}" class="detail-img">
                </div>
                  <div class="detail-info">
                    <h2 class="detail-name">${phone.name}</h2>
                    <div class="detail-brand">${phone.brand}</div>
                    <p class="detail-description">${phone.description}</p>
                    
                    <div class="detail-specs">
                        <h3>Specifications</h3>
                        <div class="spec-item">
                            <span class="spec-label">Chipset:</span>
                            <span class="spec-value">${phone.processor}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Operating System:</span>
                            <span class="spec-value">${phone.os}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Memory:</span>
                            <span class="spec-value">${phone.ram}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Storage:</span>
                            <span class="spec-value">${phone.storage}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Display:</span>
                            <span class="spec-value">${phone.display}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Sensors:</span>
                            <span class="spec-value">${phone.camera}</span>
                        </div>
                    </div>
            </div>
        `;
  }

  function goBack() {
    if (currentView === "detail") {
      // Go back to previous view (either all or search)
      const previousView = searchResults.classList.contains("hidden")
        ? "all"
        : "search";
      currentView = previousView;
      updateView();
    }
  }

  function updateView() {
    // Hide all views first
    allPhones.classList.add("hidden");
    searchResults.classList.add("hidden");
    phoneDetail.classList.add("hidden");

    // Show the active view
    if (currentView === "all") {
      allPhones.classList.remove("hidden");
    } else if (currentView === "search") {
      searchResults.classList.remove("hidden");
    } else if (currentView === "detail") {
      phoneDetail.classList.remove("hidden");
    }
  }
});
