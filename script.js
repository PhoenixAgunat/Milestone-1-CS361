// Phoenix Agunat
// Date: November 28, 2025
// Class: CS362
// Main application script to interact with saveService, loadService, updateService, and notesService.


const textarea = document.getElementById('personalData');
const saveBtn = document.getElementById('saveBtn');
const statusBox = document.getElementById('status');

const noteBtn = document.getElementById('noteBtn');
const noteOutput = document.getElementById('noteOutput');

const SAVE_URL = 'http://localhost:3001/save';
const LOAD_URL = 'http://localhost:3002/load';
const UPDATE_URL = 'http://localhost:3003/update';
const NOTES_URL = 'http://localhost:3004/note';

window.addEventListener("load", loadData);

async function loadData() {
    try {
        const res = await fetch(LOAD_URL);
        const data = await res.json();

        textarea.value = data.text || "";
    } catch (err) {
        console.error("Error loading data:", err);
        showStatus("Failed to load data.");
    
    }
}

textarea.addEventListener("input", async () => {
    const value = textarea.value;

    try {
        await fetch(UPDATE_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: value })
        });
        showStatus("Data updated.");
    } catch (err) {
        console.error("Error updating data:", err);
        showStatus("Failed to update data.");
    }
});

saveBtn.addEventListener("click", async () => {
    const value = textarea.value;

    try {
        const res = await fetch(SAVE_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: value })
        });
        const result = await res.json();
        showStatus(result.message || "Data saved successfully.");
    } catch (err) {
        console.error("Error saving data:", err);
        showStatus("Failed to save data.");
    }
});

if (noteBtn) {
    noteBtn.addEventListener("click", async () => {
        try {
            const res = await fetch(NOTES_URL);
            const data = await res.json();

            noteOutput.textContent = data.note || "No note received.";
        } catch (err) {
            console.error("Error fetching note:", err);
            noteOutput.textContent = "Failed to fetch note.";
        }
    });
}

function showStatus(message) {
    statusBox.textContent = message;

    setTimeout(() => {
        statusBox.textContent = "";
    }, 3000);
}