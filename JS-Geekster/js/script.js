const searchResult = document.querySelector("#search");
import { emojiList } from "./data.js";
const displayBody = document.querySelector("#display-emoji");
const btn = document.querySelectorAll(".filter-btn");
const filteringData = (e) => {
  let filteredData;

  if (e.target.value.toLowerCase() === "all") {
    filteredData = emojiList;
  } else {
    filteredData = emojiList.filter((emoji) => {
      if (
        emoji.description.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return true;
      }
      if (
        emoji.aliases.some((alias) =>
          alias.toLowerCase().startsWith(e.target.value.toLowerCase())
        )
      ) {
        return true;
      }
      if (
        emoji.tags.some((tag) =>
          tag.toLowerCase().startsWith(e.target.value.toLowerCase())
        )
      ) {
        return true;
      }
      return false;
    });
  }
  return filteredData;
};

const filteringBtn = () => {
  btn.forEach((b) => {
    b.addEventListener("click", () => {
      const dataAttribute = b.getAttribute("data-category");
      const filteredData = filteringData({ target: { value: dataAttribute } });
      console.log(dataAttribute, filteredData);
      displayBody.innerHTML = "";
      filteredData.forEach((data) => {
        const emojiElement = document.createElement("span");
        emojiElement.textContent = data.emoji;
        displayBody.appendChild(emojiElement);
      });
    });
  });
};

filteringBtn();
// Debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// Function to create and show loader
const showLoader = () => {
  const loader = document.createElement("div");
  loader.className = "loader"; // Add class to apply styles

  // Check if styles are already added
  if (!document.getElementById("loader-style")) {
    const style = document.createElement("style");
    style.id = "loader-style";
    style.innerHTML = `
      .loader {
        width: 40px;
        height: 26px;
        --c:no-repeat linear-gradient(#000 0 0);
        background:
          var(--c) 0    100%,
          var(--c) 50%  100%,
          var(--c) 100% 100%;
        background-size:8px calc(100% - 4px);
        position: relative;
      }
      .loader:before {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #000;
        left: 0;
        top: 0;
        animation: 
          l3-1 1.5s  linear infinite alternate,
          l3-2 0.75s cubic-bezier(0,200,.8,200) infinite;
      }
      @keyframes l3-1 {
        100% {left:calc(100% - 8px)}
      }
      @keyframes l3-2 {
        100% {top:-0.1px}
      }
    `;
    document.head.appendChild(style);
  }

  displayBody.innerHTML = ""; // Clear previous results
  displayBody.appendChild(loader);
  return loader;
};
// Function to handle search input
const handleSearch = (e) => {
  const loader = showLoader(); // Show loader dynamically

  setTimeout(() => {
    const result = filteringData(e);
    console.log(result);

    const emojis = result.map((data) => data.emoji);
    console.log(emojis);

    displayBody.innerHTML = ""; // Clear previous results

    emojis.forEach((e) => {
      const emojiElement = document.createElement("span");
      emojiElement.textContent = e;
      displayBody.appendChild(emojiElement);
    });

    loader.remove(); // Remove loader after displaying results
  }, 1000); // Simulating async behavior
};

// Attach debounced event listener
searchResult.addEventListener("input", debounce(handleSearch, 300));

window.onload = function () {
  console.log("Window loaded");
  displayBody.innerHTML = "";
  emojiList.forEach((e) => {
    const emojiElement = document.createElement("span");
    emojiElement.textContent = e.emoji;
    displayBody.appendChild(emojiElement);
  });
};
