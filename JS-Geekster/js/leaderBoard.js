// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const form = document.querySelector("form");
  const fnameInput = document.querySelector(".fname");
  const lnameInput = document.querySelector(".lname");
  const countrySelect = document.querySelector(".country");
  const scoreInput = document.querySelector(".score");
  const leaderboardContainer = document.getElementById("leaderboard-container");

  // Create table structure for leaderboard if it doesn't exist
  if (!document.getElementById("leaderboard-table")) {
    const table = document.createElement("table");
    table.id = "leaderboard-table";
    table.className = "w-full text-blue-300";

    // Create table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
            <tr class="border-b border-blue-500/50">
                <th class="py-2 px-4 text-left">Rank</th>
                <th class="py-2 px-4 text-left">Name</th>
                <th class="py-2 px-4 text-left">Planet</th>
                <th class="py-2 px-4 text-center">Battle Points</th>
                <th class="py-2 px-4 text-center">Actions</th>
            </tr>
        `;

    // Create table body
    const tbody = document.createElement("tbody");
    tbody.id = "leaderboard-body";

    // Append elements to table and container
    table.appendChild(thead);
    table.appendChild(tbody);
    leaderboardContainer.appendChild(table);
  }

  // Array to store player data
  let players = [];

  // Form submission handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    // Add player to the array
    addPlayer();

    // Show leaderboard container
    leaderboardContainer.classList.remove("hidden");

    // Reset form
    form.reset();
  });

  // Validate form inputs
  function validateForm() {
    let isValid = true;

    // Check first name
    if (fnameInput.value.trim() === "") {
      highlightError(fnameInput);
      isValid = false;
    } else {
      removeError(fnameInput);
    }

    // Check last name
    if (lnameInput.value.trim() === "") {
      highlightError(lnameInput);
      isValid = false;
    } else {
      removeError(lnameInput);
    }

    // Check country/planet
    if (countrySelect.value === "") {
      highlightError(countrySelect);
      isValid = false;
    } else {
      removeError(countrySelect);
    }

    // Check score
    if (scoreInput.value === "" || isNaN(parseInt(scoreInput.value))) {
      highlightError(scoreInput);
      isValid = false;
    } else {
      removeError(scoreInput);
    }

    return isValid;
  }

  // Highlight error on input element
  function highlightError(element) {
    element.classList.add("border-red-500");
    element.classList.add("animate__animated", "animate__shakeX");

    // Remove animation class after animation completes
    setTimeout(() => {
      element.classList.remove("animate__animated", "animate__shakeX");
    }, 1000);
  }

  // Remove error highlighting
  function removeError(element) {
    element.classList.remove("border-red-500");
  }

  // Add player to array and update table
  function addPlayer() {
    const player = {
      id: Date.now(), // Unique ID using timestamp
      firstName: fnameInput.value.trim(),
      lastName: lnameInput.value.trim(),
      fullName: `${fnameInput.value.trim()} ${lnameInput.value.trim()}`,
      planet: countrySelect.value,
      score: parseInt(scoreInput.value),
    };

    // Add to players array
    players.push(player);

    // Sort and update the table
    sortAndUpdateTable();
  }

  // Sort players by score and update table
  function sortAndUpdateTable() {
    // Sort players by score (descending)
    players.sort((a, b) => b.score - a.score);

    // Get table body
    const tbody = document.getElementById("leaderboard-body");

    // Clear existing rows
    tbody.innerHTML = "";

    // Add players to table
    players.forEach((player, index) => {
      const row = document.createElement("tr");
      row.dataset.id = player.id;
      row.className =
        "border-b border-blue-500/30 hover:bg-blue-900/20 transition-colors";

      // Apply animation to new row
      row.classList.add("animate__animated", "animate__fadeIn");

      // Set row content
      row.innerHTML = `
                <td class="py-3 px-4 font-bold">${index + 1}</td>
                <td class="py-3 px-4">${player.fullName}</td>
                <td class="py-3 px-4">${player.planet}</td>
                <td class="py-3 px-4 text-center font-mono font-bold text-xl">${
                  player.score
                }</td>
                <td class="py-3 px-4 text-center">
                    <div class="flex justify-center space-x-2">
                        <button class="minus-btn sw-border px-2 py-1 rounded hover:bg-red-900/30 transition-colors">-5</button>
                        <button class="plus-btn sw-border px-2 py-1 rounded hover:bg-green-900/30 transition-colors">+5</button>
                        <button class="delete-btn sw-border px-2 py-1 rounded hover:bg-red-900/50 transition-colors">Delete</button>
                    </div>
                </td>
            `;

      // Append row to table body
      tbody.appendChild(row);
    });

    // Add event listeners to buttons
    addButtonEventListeners();
  }

  // Add event listeners to the button in each row
  function addButtonEventListeners() {
    // Plus buttons
    document.querySelectorAll(".plus-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr");
        const playerId = parseInt(row.dataset.id);

        // Find player and update score
        const player = players.find((p) => p.id === playerId);
        if (player) {
          player.score += 5;

          // Animate score change
          const scoreCell = row.querySelector("td:nth-child(4)");
          scoreCell.textContent = player.score;
          scoreCell.classList.add(
            "animate__animated",
            "animate__pulse",
            "text-green-300"
          );

          setTimeout(() => {
            scoreCell.classList.remove(
              "animate__animated",
              "animate__pulse",
              "text-green-300"
            );
          }, 1000);

          // Resort and update table
          sortAndUpdateTable();
        }
      });
    });

    // Minus buttons
    document.querySelectorAll(".minus-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr");
        const playerId = parseInt(row.dataset.id);

        // Find player and update score
        const player = players.find((p) => p.id === playerId);
        if (player) {
          player.score -= 5;

          // Animate score change
          const scoreCell = row.querySelector("td:nth-child(4)");
          scoreCell.textContent = player.score;
          scoreCell.classList.add(
            "animate__animated",
            "animate__pulse",
            "text-red-300"
          );

          setTimeout(() => {
            scoreCell.classList.remove(
              "animate__animated",
              "animate__pulse",
              "text-red-300"
            );
          }, 1000);

          // Resort and update table
          sortAndUpdateTable();
        }
      });
    });

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr");
        const playerId = parseInt(row.dataset.id);

        // Animate row removal
        row.classList.add("animate__animated", "animate__fadeOutRight");

        // Remove player after animation
        setTimeout(() => {
          // Remove player from array
          players = players.filter((p) => p.id !== playerId);

          // Update table
          sortAndUpdateTable();

          // Hide container if no players
          if (players.length === 0) {
            leaderboardContainer.classList.add("hidden");
          }
        }, 500);
      });
    });
  }

  // Add initial event listeners for form elements
  fnameInput.addEventListener("input", () => removeError(fnameInput));
  lnameInput.addEventListener("input", () => removeError(lnameInput));
  countrySelect.addEventListener("change", () => removeError(countrySelect));
  scoreInput.addEventListener("input", () => removeError(scoreInput));
});
