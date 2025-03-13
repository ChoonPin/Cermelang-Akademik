document.addEventListener("DOMContentLoaded", function() {
    const db = window.db;
    const { collection, getDocs, doc, setDoc, getDoc, updateDoc, onSnapshot } = window.firestoreFunctions;

    const positionSelect = document.getElementById("positionSelect");
    const positionList = document.getElementById("positionList");

    // Default AJK positions
    const defaultPositions = [
        { id: "timbalan_pengarah", name: "Timbalan Pengarah", quota: 1 },
        { id: "setiausaha", name: "Setiausaha", quota: 1 },
        { id: "bendahari", name: "Bendahari", quota: 1 },
        { id: "urus_setia", name: "Unit Urus Setia", quota: 2 },
        { id: "logistik", name: "Unit Logistik", quota: 2 },
        { id: "teknikal", name: "Unit Teknikal", quota: 2 },
        { id: "publisiti", name: "Unit Publisiti", quota: 2 },
        { id: "protokol", name: "Unit Protokol", quota: 2 }
    ];

    async function initializePositions() {
        const positionsRef = collection(db, "positions");
        const snapshot = await getDocs(positionsRef);

        if (snapshot.empty) {
            for (const pos of defaultPositions) {
                await setDoc(doc(db, "positions", pos.id), {
                    name: pos.name,
                    quota: pos.quota
                });
            }
        }
        loadPositions();
    }

    function loadPositions() {
        const positionsRef = collection(db, "positions");

        onSnapshot(positionsRef, (snapshot) => {
            positionSelect.innerHTML = "";
            positionList.innerHTML = "";

            snapshot.docs.forEach((doc) => {
                let data = doc.data();

                // Add to dropdown
                let option = document.createElement("option");
                option.value = doc.id;
                option.textContent = `${data.name} (Remaining: ${data.quota})`;
                positionSelect.appendChild(option);

                // Add to display list
                let li = document.createElement("li");
                li.textContent = `${data.name}: ${data.quota} slots left`;
                positionList.appendChild(li);
            });
        });
    }

    initializePositions();

    document.getElementById("ajkForm").addEventListener("submit", async function(e) {
        e.preventDefault();

        let fullName = document.getElementById("fullName").value.trim();
        let matricNumber = document.getElementById("matricNumber").value.trim();
        let positionId = positionSelect.value;

        if (!fullName || !matricNumber || !positionId) {
            alert("Please fill in all fields.");
            return;
        }

        const applicationsRef = collection(db, "applications");
        const positionRef = doc(db, "positions", positionId);
        const positionSnap = await getDoc(positionRef);

        if (!positionSnap.exists()) {
            alert("Position not found.");
            return;
        }

        let positionData = positionSnap.data();

        if (positionData.quota > 0) {
            await updateDoc(positionRef, { quota: positionData.quota - 1 });

            await setDoc(doc(applicationsRef, matricNumber), {
                fullName: fullName,
                matricNumber: matricNumber,
                position: positionId,
                timestamp: new Date()
            });

            alert("Successfully applied!");
            loadPositions();
            document.getElementById("ajkForm").reset();
        } else {
            alert("Sorry, this position is full.");
        }
    });
});
