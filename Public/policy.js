// ✅ Load Airlines for Dropdown
function loadAirlines() {
    let dropdown = document.getElementById("airlineDropdown");
    let selectedValue = dropdown.value; // Save the current selection

    fetch("/api/airlines")
        .then(response => response.json())
        .then(data => {
            console.log("Airline Data", data);
            dropdown.innerHTML = '<option value="">Select an Airline</option>'; // Reset options

            data.data.forEach(airline => {
                console.log("Airline", airline);
                let option = document.createElement("option");
                option.value = airline.AirlineName;
                option.textContent = airline.AirlineName;
                
                if (option.value === selectedValue) {
                    option.selected = true;
                }

                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading airlines:", error));
}

// ✅ Fetch Bicycle Policy
function fetchPolicy(event) {
    event.preventDefault();
    let selectedAirline = document.getElementById("airlineDropdown").value;

    if (!selectedAirline) {
        alert("Please select an airline first!");
        return;
    }

    fetch(`/api/restrictions/name/${selectedAirline}`)
    .then(response => response.json())
    .then(data => {
        console.log("Policy Data:", data);

        if (!data) {
            document.getElementById("result").innerHTML = 
                `<p>No bicycle policy found for ${selectedAirline}.</p>`;
            return;
        }

       // let airline = data.AirlineID || "N/A";
       console.log("Data", data);
            let maxWeight = data.data[0].MaxWeight ? `${data.data[0].MaxWeight} kg` : "N/A";
            let maxLength = data.data[0].MaxLength ? `${data.data[0].MaxLength} cm` : "N/A";
            let maxWidth = data.data[0].MaxWidth ? `${data.data[0].MaxWidth} cm` : "N/A";
            let maxHeight = data.data[0].MaxHeight ? `${data.data[0].MaxHeight} cm` : "N/A";

            document.getElementById("result").innerHTML = `
             
            <table border="1" class="policy-table">
                <tr>
                    <th>Max Weight</th>
                    <th>Max Length</th>
                    <th>Max Width</th>
                    <th>Max Height</th>
                </tr>
                <tr>
                    <td>${maxWeight}</td>
                    <td>${maxLength}</td>
                    <td>${maxWidth}</td>
                    <td>${maxHeight}</td>
                </tr>
            </table>
        `;
        // resultContainer.style.display = "block";
    })
    .catch(error => {
        console.error("Error fetching policy:", error);
        document.getElementById("result").innerHTML = 
            `<p>Error fetching policy for ${selectedAirline}.</p>`;
    });
}
