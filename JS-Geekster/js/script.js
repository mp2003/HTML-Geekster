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
searchResult.addEventListener("input", (e) => {
  const result = filteringData(e);
  console.log(result);
  const emojis = result.map((data) => {
    return data.emoji;
  });
  console.log(emojis);
  displayBody.innerHTML = "";
  emojis.forEach((e) => {
    const emojiElement = document.createElement("span");
    emojiElement.textContent = e;
    displayBody.appendChild(emojiElement);
  });
});

window.onload = function () {
  console.log("Window loaded");
  displayBody.innerHTML = "";
  emojiList.forEach((e) => {
    const emojiElement = document.createElement("span");
    emojiElement.textContent = e.emoji;
    displayBody.appendChild(emojiElement);
  });
};
