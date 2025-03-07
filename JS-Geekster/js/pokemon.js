// Global variables
const API_BASE_URL = "https://pokeapi.co/api/v2/";
let allPokemon = [];
let currentPokemon = [];
let types = [];

// DOM Elements
const pokemonGrid = document.getElementById("pokemonGrid");
const typeSelect = document.getElementById("typeSelect");
const filterBtn = document.getElementById("filterBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const noResults = document.getElementById("noResults");

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();

  // Event listeners
  filterBtn.addEventListener("click", filterByType);
  resetBtn.addEventListener("click", resetFilters);
  searchBtn.addEventListener("click", searchPokemon);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchPokemon();
    }
  });
});

// Initialize the application by fetching types and pokemon
async function initializeApp() {
  showLoading(true);
  try {
    // Fetch all pokemon types
    await fetchPokemonTypes();

    // Fetch initial pokemon data
    await fetchPokemon();

    // Hide loading indicator
    showLoading(false);
  } catch (error) {
    console.error("Error initializing app:", error);
    showLoading(false);
    alert("Failed to load Pokémon data. Please try again later.");
  }
}

// Fetch all available pokemon types
async function fetchPokemonTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}type`);
    const data = await response.json();

    types = data.results;

    // Populate type select dropdown
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.name;
      option.textContent = capitalizeFirstLetter(type.name);
      typeSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching pokemon types:", error);
    throw error;
  }
}

// Fetch pokemon data for display
async function fetchPokemon(typeUrl = null) {
  try {
    let url;

    if (typeUrl) {
      // If type URL is provided, fetch pokemon of that type
      const response = await fetch(typeUrl);
      const data = await response.json();
      allPokemon = await Promise.all(
        data.pokemon.map(async (p) => {
          const pokemonResponse = await fetch(p.pokemon.url);
          return await pokemonResponse.json();
        })
      );
    } else {
      // Fetch the first 151 pokemon (original generation)
      const response = await fetch(`${API_BASE_URL}pokemon?limit=151`);
      const data = await response.json();

      allPokemon = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          return await pokemonResponse.json();
        })
      );
    }

    // Set the current pokemon to display all
    currentPokemon = [...allPokemon];

    // Display the pokemon
    displayPokemon(currentPokemon);
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    throw error;
  }
}

// Display pokemon in the grid
function displayPokemon(pokemonList) {
  // Clear previous content
  pokemonGrid.innerHTML = "";

  if (pokemonList.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  // Create and append pokemon cards
  pokemonList.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    pokemonGrid.appendChild(card);
  });
}

// Create a pokemon card element
function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";

  // Front of card (basic info)
  const cardFront = document.createElement("div");
  cardFront.className = "card-front";

  const imageContainer = document.createElement("div");
  imageContainer.className = "pokemon-image";

  const img = document.createElement("img");
  img.src =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default ||
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
  img.alt = pokemon.name;
  img.onerror = () => {
    img.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
  };

  imageContainer.appendChild(img);

  const info = document.createElement("div");
  info.className = "pokemon-info";

  const name = document.createElement("h2");
  name.className = "pokemon-name";
  name.textContent = capitalizeFirstLetter(pokemon.name);

  const types = document.createElement("div");
  types.className = "pokemon-types";

  pokemon.types.forEach((typeInfo) => {
    const type = document.createElement("span");
    type.className = `type-badge type-${typeInfo.type.name}`;
    type.textContent = typeInfo.type.name;
    types.appendChild(type);
  });

  const flipHint = document.createElement("div");
  flipHint.className = "flip-hint";
  flipHint.innerHTML = '<i class="fas fa-sync-alt"></i> Click for details';

  info.appendChild(name);
  info.appendChild(types);

  cardFront.appendChild(imageContainer);
  cardFront.appendChild(info);
  cardFront.appendChild(flipHint);

  // Back of card (detailed info)
  const cardBack = document.createElement("div");
  cardBack.className = "card-back";

  // Pokemon ID and weight/height
  const basicInfo = document.createElement("div");
  basicInfo.innerHTML = `
        <p><strong>ID:</strong> #${pokemon.id.toString().padStart(3, "0")}</p>
        <p><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)}m</p>
        <p><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)}kg</p>
    `;

  // Stats section
  const statsSection = document.createElement("div");
  statsSection.className = "pokemon-stats";

  const statsTitle = document.createElement("h3");
  statsTitle.className = "stats-title";
  statsTitle.textContent = "Stats";

  statsSection.appendChild(statsTitle);

  // Create stat bars
  pokemon.stats.forEach((stat) => {
    const statContainer = document.createElement("div");
    statContainer.className = "stat";

    const statName = document.createElement("span");
    statName.textContent = formatStatName(stat.stat.name);

    const statValue = document.createElement("span");
    statValue.textContent = stat.base_stat;

    const statBarContainer = document.createElement("div");
    statBarContainer.className = "stat-bar";
    statBarContainer.style.width = "100%";

    const statFill = document.createElement("div");
    statFill.className = "stat-fill";
    statFill.style.width = `${Math.min(stat.base_stat, 100)}%`;

    statBarContainer.appendChild(statFill);

    statContainer.appendChild(statName);
    statContainer.appendChild(statValue);
    statContainer.appendChild(statBarContainer);

    statsSection.appendChild(statContainer);
  });

  // Abilities section
  const abilitiesSection = document.createElement("div");
  abilitiesSection.className = "pokemon-abilities";

  const abilitiesTitle = document.createElement("h3");
  abilitiesTitle.className = "abilities-title";
  abilitiesTitle.textContent = "Abilities";

  abilitiesSection.appendChild(abilitiesTitle);

  // Create ability list
  pokemon.abilities.forEach((abilityInfo) => {
    const ability = document.createElement("div");
    ability.className = "ability";
    ability.textContent = abilityInfo.ability.name.replace("-", " ");
    abilitiesSection.appendChild(ability);
  });

  cardBack.appendChild(basicInfo);
  cardBack.appendChild(statsSection);
  cardBack.appendChild(abilitiesSection);

  // Add both sides to the card
  card.appendChild(cardFront);
  card.appendChild(cardBack);

  // Add flip functionality
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  return card;
}

// Filter pokemon by type
async function filterByType() {
  const selectedType = typeSelect.value;

  if (!selectedType) {
    alert("Please select a type to filter");
    return;
  }

  showLoading(true);

  try {
    // Get the URL for the selected type
    const typeUrl = `${API_BASE_URL}type/${selectedType}`;

    // Fetch pokemon of the selected type
    await fetchPokemon(typeUrl);

    showLoading(false);
  } catch (error) {
    console.error("Error filtering by type:", error);
    showLoading(false);
    alert("Failed to filter Pokémon. Please try again.");
  }
}

// Reset all filters and show all pokemon
async function resetFilters() {
  showLoading(true);

  try {
    // Clear search input
    searchInput.value = "";

    // Reset type selection
    typeSelect.selectedIndex = 0;

    // Fetch all pokemon
    await fetchPokemon();

    showLoading(false);
  } catch (error) {
    console.error("Error resetting filters:", error);
    showLoading(false);
    alert("Failed to reset filters. Please try again.");
  }
}

// Search pokemon by name
function searchPokemon() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm === "") {
    // If search is empty, show all pokemon
    currentPokemon = [...allPokemon];
  } else {
    // Filter pokemon by name
    currentPokemon = allPokemon.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchTerm);
    });
  }

  // Display the filtered pokemon
  displayPokemon(currentPokemon);
}

// Helper Functions

// Show or hide the loading indicator
function showLoading(show) {
  if (show) {
    loadingIndicator.style.display = "flex";
    pokemonGrid.style.display = "none";
  } else {
    loadingIndicator.style.display = "none";
    pokemonGrid.style.display = "grid";
  }
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Format stat names for better display
function formatStatName(statName) {
  switch (statName) {
    case "hp":
      return "HP";
    case "attack":
      return "Attack";
    case "defense":
      return "Defense";
    case "special-attack":
      return "Sp. Atk";
    case "special-defense":
      return "Sp. Def";
    case "speed":
      return "Speed";
    default:
      return capitalizeFirstLetter(statName);
  }
}
