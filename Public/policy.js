// ✅ Base URL for your backend API
const API_BASE = "https://bikeyourflight.onrender.com";

// ✅ Load Airlines for Dropdown
function loadAirlines() {
    const dropdown = document.getElementById("airlineDropdown");
    const selectedValue = dropdown.value; // Save current selection

    fetch(`${API_BASE}/api/airlines`)
        .then(response => response.json())
        .then(data => {
            console.log("Airline Data:", data);
            dropdown.innerHTML = '<option value="">Select an Airline</option>';

            data.data.forEach(airline => {
                console.log("Airline:", airline);
                const option = document.createElement("option");
                option.value = airline.AirlineName;
                option.textContent = airline.AirlineName;

                if (option.value === selectedValue) {
                    option.selected = true;
                }

                dropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error loading airlines:", error);
            dropdown.innerHTML = '<option value="">Error loading airlines</option>';
        });
}

/* // ✅ Fetch Bicycle Policy
function fetchPolicy(event) {
    event.preventDefault();
    const selectedAirline = document.getElementById("airlineDropdown").value;

    if (!selectedAirline) {
        alert("Please select an airline first!");
        return;
    }

    // Optional: show loading indicator
    document.getElementById("result").innerHTML = `<p>Loading policy...</p>`;

    fetch(`${API_BASE}/api/restrictions/name/${encodeURIComponent(selectedAirline)}`)
        .then(response => response.json())
        .then(data => {
            console.log("Policy Data:", data);

            if (!data || !data.data || data.data.length === 0) {
                document.getElementById("result").innerHTML = 
                    `<p>No bicycle policy found for ${selectedAirline}.</p>`;
                return;
            }

            const restriction = data.data[0];

            const maxWeight = restriction.MaxWeight ? `${restriction.MaxWeight} kg` : "N/A";
            const maxLength = restriction.MaxLength ? `${restriction.MaxLength} cm` : "N/A";
            const maxWidth = restriction.MaxWidth ? `${restriction.MaxWidth} cm` : "N/A";
            const maxHeight = restriction.MaxHeight ? `${restriction.MaxHeight} cm` : "N/A";

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
        })
        .catch(error => {
            console.error("Error fetching policy:", error);
            document.getElementById("result").innerHTML = 
                `<p>Error fetching policy for ${selectedAirline}.</p>`;
        });
} */


function fetchPolicy(event) {
  event.preventDefault();
  const selectedAirline = document.getElementById("airlineDropdown").value;

  if (!selectedAirline) {
    alert("Please select an airline first!");
    return;
  }

  document.getElementById("result").innerHTML = `<p>Loading policy...</p>`;

  console.log("Fetching policy for:", selectedAirline);
  fetch(`${API_BASE}/api/airlines/name/${encodeURIComponent(selectedAirline)}`)
    .then(response => response.json())
    .then(data => {
      console.log("Policy Data:", data);

      if (!data || !data.data) {
        document.getElementById("result").innerHTML =
          `<p>No policy found for ${selectedAirline}.</p>`;
        return;
      }

      const policy = data.data.BicyclePolicy || "No policy provided.";

      document.getElementById("result").innerHTML = `
        <div class="policy-description">
          <strong>Bicycle Policy for ${selectedAirline}:</strong>
          <p>${policy}</p>
        </div>
      `;
    })
    .catch(error => {
      console.error("Error fetching policy:", error);
      document.getElementById("result").innerHTML =
        `<p>Error fetching policy for ${selectedAirline}.</p>`;
    });
}
