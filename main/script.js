
// Message for data found in storage
window.addEventListener("load", ()=> {
    const savedData = localStorage.getItem("personalData");
    const textarea = document.getElementById("personalData");
    if (savedData) {
        textarea.value = savedData;
        showStatus("Data loaded from storage.");
    } else {
        showStatus("No data found");
    }
});

// Message for data entered is automatically saved
document.getElementById("personalData").addEventListener("input", (event) => {
    const value = event.target.value;
    localStorage.setItem("personalData", value);
    showStatus("Data saved automatically.");
});

// Message for users changes is automatically saved
document.getElementById("saveBtn").addEventListener("click", () => {
    const value = document.getElementById("personalData").value;
    localStorage.setItem("personalData", value);
    showStatus("Changes are saved and displayed");
});

function showStatus(message) {
    const status = document.getElementById("status");
    status.textContent = message;

    setTimeout(() => {
        status.textContent = "";

    }, 3000);
}