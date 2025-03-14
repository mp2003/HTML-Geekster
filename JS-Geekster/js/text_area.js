const textArea = document.querySelector("#text-ar");
const preview = document.querySelector("#preview");
const btnSave = document.querySelector("#btn-save");
const btnLoad = document.querySelector("#btn-load");
const btnClear = document.querySelector("#btn-clear");
const btnCopy = document.querySelector("#btn-copy");
const fontSelect = document.querySelector("#font-select");
const fontSize = document.querySelector("#font-size");
const themeToggle = document.querySelector("#theme-toggle");
const wordCount = document.querySelector("#word-count");
const autoSaveIndicator = document.querySelector("#auto-save-indicator");
const savedNotesContainer = document.querySelector("#saved-notes");
const body = document.body;

let isDarkMode = false;
let saveTimeout;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function init() {
  const savedText = localStorage.getItem("text") || "";
  textArea.value = savedText;
  updatePreview();
  updateWordCount();
  displaySavedNotes();

  textArea.addEventListener("input", handleTextInput);
  btnSave.addEventListener("click", saveNote);
  btnLoad.addEventListener("click", loadFromStorage);
  btnClear.addEventListener("click", clearText);
  btnCopy.addEventListener("click", copyText);
  fontSelect.addEventListener("change", updateFontFamily);
  fontSize.addEventListener("change", updateFontSize);
  themeToggle.addEventListener("click", toggleTheme);
}

function handleTextInput() {
  autoSaveIndicator.textContent = "Saving...";
  autoSaveIndicator.classList.remove("text-green-400");
  autoSaveIndicator.classList.add("text-yellow-400");
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem("text", textArea.value);
    updatePreview();
    updateWordCount();
    autoSaveIndicator.textContent = "Changes saved";
    autoSaveIndicator.classList.remove("text-yellow-400");
    autoSaveIndicator.classList.add("text-green-400");
  }, 500);
}

function updatePreview() {
  if (textArea.value.trim() === "") {
    preview.innerHTML =
      '<p class="text-gray-500 italic">Text preview will appear here...</p>';
  } else {
    const formattedText = textArea.value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
    preview.innerHTML = formattedText;
  }
}

function updateWordCount() {
  const text = textArea.value;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  wordCount.textContent = `${words} words | ${chars} characters`;
}

function saveNote() {
  if (textArea.value.trim() === "") {
    alert("Cannot save empty note!");
    return;
  }

  const noteName = prompt(
    "Enter a name for this note:",
    `Note ${notes.length + 1}`
  );
  if (noteName) {
    const newNote = {
      id: Date.now(),
      name: noteName,
      content: textArea.value,
      date: new Date().toLocaleString(),
    };

    notes.unshift(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    displaySavedNotes();
  }
}

function displaySavedNotes() {
  if (notes.length === 0) {
    savedNotesContainer.innerHTML =
      '<p class="text-gray-500 italic">Your saved notes will appear here...</p>';
    return;
  }

  savedNotesContainer.innerHTML = "";
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.className =
      "flex justify-between items-center p-2 mb-1 bg-white rounded border border-gray-200 hover:bg-blue-50 cursor-pointer";
    noteElement.innerHTML = `
            <span class="font-medium">${note.name}</span>
            <div class="flex items-center">
              <span class="text-xs text-gray-500 mr-2">${note.date}</span>
              <button class="text-red-500 hover:text-red-700 delete-note" data-id="${note.id}">✕</button>
            </div>
          `;

    noteElement.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-note")) {
        textArea.value = note.content;
        updatePreview();
        updateWordCount();
        localStorage.setItem("text", note.content);
      }
    });

    savedNotesContainer.appendChild(noteElement);
  });

  document.querySelectorAll(".delete-note").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const noteId = parseInt(e.target.getAttribute("data-id"));
      deleteNote(noteId);
    });
  });
}

function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes = notes.filter((note) => note.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(notes));
    displaySavedNotes();
  }
}

function loadFromStorage() {
  const savedText = localStorage.getItem("text") || "";
  textArea.value = savedText;
  updatePreview();
  updateWordCount();
}

function clearText() {
  if (
    confirm("Are you sure you want to clear the editor? This cannot be undone.")
  ) {
    textArea.value = "";
    localStorage.setItem("text", "");
    updatePreview();
    updateWordCount();
  }
}

function copyText() {
  textArea.select();
  document.execCommand("copy");

  btnCopy.textContent = "Copied!";
  setTimeout(() => {
    btnCopy.textContent = "Copy";
  }, 1000);
}

function updateFontFamily() {
  textArea.classList.remove("font-sans", "font-serif", "font-mono");

  switch (fontSelect.value) {
    case "sans":
      textArea.classList.add("font-sans");
      break;
    case "serif":
      textArea.classList.add("font-serif");
      break;
    case "mono":
      textArea.classList.add("font-mono");
      break;
  }
}

function updateFontSize() {
  textArea.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
  textArea.classList.add(fontSize.value);
}

function toggleTheme() {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    body.classList.remove("bg-gray-100");
    body.classList.add("bg-slate-600");
    textArea.classList.remove("bg-white", "text-black", "border-slate-300");
    textArea.classList.add("bg-slate-800", "text-white", "border-slate-600");
    themeToggle.textContent = "Light Mode";
    preview.classList.remove("bg-gray-50");
    preview.classList.add("bg-slate-700", "text-white", "border-slate-600");
  } else {
    body.classList.remove("bg-slate-600");
    body.classList.add("bg-gray-100");
    textArea.classList.remove("bg-slate-800", "text-white", "border-slate-600");
    textArea.classList.add("bg-white", "text-black", "border-slate-300");
    themeToggle.textContent = "Dark Mode";
    preview.classList.remove("bg-slate-700", "text-white", "border-slate-600");
    preview.classList.add("bg-gray-50");
  }
}

document.addEventListener("DOMContentLoaded", init);
