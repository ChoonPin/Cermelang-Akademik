// Available positions with slots
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

// Populate the dropdown and positions list
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
}

// Handle application submission
document.getElementById("applyBtn").addEventListener("click", () => {
    let fullName = document.getElementById("fullName").value.trim();
    let matricNumber = document.getElementById("matricNumber").value.trim();
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    let selectedPosition = document.getElementById("positionSelect").value;

    if (!fullName || !matricNumber || !phoneNumber) {
        alert("Please fill in all fields.");
        return;
    }

    if (positions[selectedPosition] > 0) {
        positions[selectedPosition]--;

        let table = document.getElementById("applicationsTable");
        let existingRow = [...table.rows].find(row => row.cells[0].textContent === selectedPosition);

        if (existingRow) {
            existingRow.cells[1].textContent += `, ${fullName} (${matricNumber})`;
        } else {
            let row = table.insertRow();
            row.insertCell(0).textContent = selectedPosition;
            row.insertCell(1).textContent = `${fullName} (${matricNumber})`;
        }

        updatePositionDisplay();
    } else {
        alert("No slots available for this position.");
    }
});

// Shadow DOM implementation
document.addEventListener("DOMContentLoaded", () => {
    let shadowHost = document.createElement("div");
    document.body.appendChild(shadowHost);

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

    updatePositionDisplay();
});
