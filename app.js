// Define available positions with their slot limits
let positions = {
    "Bendahari": 0,
    "Unit Logistik": 2,
    "Unit Protokol": 1,
    "Unit Publisiti": 2,
    "Setiausaha": 0,
    "Unit Teknikal": 2,
    "Timbalan Pengarah": 0,
    "Unit Urus Setia": 0
};

// Store applicants in an object format: { positionName: [applicant1, applicant2] }
let applicants = {};

// Populate the dropdown and available positions list
function updatePositionDisplay() {
    let positionSelect = document.getElementById("positionSelect");
    let availablePositionsDiv = document.getElementById("availablePositions");

    positionSelect.innerHTML = ""; 
    availablePositionsDiv.innerHTML = "";

    Object.keys(positions).forEach(position => {
        let option = document.createElement("option");
        option.value = position;
        option.textContent = `${position} (Remaining: ${positions[position]})`;
        if (positions[position] === 0) {
            option.disabled = true;
        }
        positionSelect.appendChild(option);

        let positionText = document.createElement("p");
        positionText.textContent = `${position}: ${positions[position]} slots left`;
        availablePositionsDiv.appendChild(positionText);
    });

    updateTableDisplay(); // Ensure the table updates whenever positions update
}

// Update the applications table
function updateTableDisplay() {
    let tableBody = document.getElementById("applicationsTable");
    tableBody.innerHTML = ""; // Clear old table entries

    Object.keys(applicants).forEach(position => {
        let row = tableBody.insertRow();
        row.insertCell(0).textContent = position;
        row.insertCell(1).textContent = applicants[position].join(", ");
    });
}

// Handle application submission
document.getElementById("applyBtn").addEventListener("click", () => {
    let fullName = document.getElementById("fullName").value.trim();
    let matricNumber = document.getElementById("matricNumber").value.trim();
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    let selectedPosition = document.getElementById("positionSelect").value;

    // Validate input fields
    if (!fullName || !matricNumber || !phoneNumber) {
        alert("Please fill in all fields.");
        return;
    }

    if (positions[selectedPosition] > 0) {
        positions[selectedPosition]--; // Reduce available slots

        let applicantInfo = `${fullName} (${matricNumber})`;

        if (!applicants[selectedPosition]) {
            applicants[selectedPosition] = [];
        }
        applicants[selectedPosition].push(applicantInfo);

        updatePositionDisplay(); // Refresh positions
    } else {
        alert("No slots available for this position.");
    }
});

// Fix: Prevent duplicate shadow DOM creation
document.addEventListener("DOMContentLoaded", () => {
    let shadowHost = document.createElement("div");
    document.body.appendChild(shadowHost);

    // ✅ Ensure shadow DOM is created only once
    if (!shadowHost.shadowRoot) {
        let shadowRoot = shadowHost.attachShadow({ mode: "open" });

        let style = document.createElement("style");
        style.textContent = `
            p {
                color: blue;
                font-weight: bold;
            }
        `;

        let message = document.createElement("p");
        message.textContent = "Shadow DOM Initialized!";
        
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(message);
    } else {
        console.warn("Shadow root already exists. Skipping.");
    }

    updatePositionDisplay(); // Ensure UI updates when the page loads
});
