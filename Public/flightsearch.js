// ✅ Search Flights
function searchFlights() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const departureDate = document.getElementById("departure_date").value;

    if (!origin || !destination || !departureDate) {
        alert("Please fill all fields.");
        return;
    }

    fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, departure_date: departureDate })
    })
    .then(response => response.json())
    .then(data => {
        displayOffers(data.data);
    })
    .catch(error => console.error("Error searching flights:", error));
}

// ✅ Display Flight Offers
function displayOffers(offers) {
    const offersContainer = document.getElementById("offers-container");
    const offersList = document.getElementById("offers-list");
    offersContainer.classList.remove("hidden");
    offersList.innerHTML = "";

    offers.forEach(offer => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${offer.owner.name}</strong> - ${offer.total_amount} ${offer.total_currency}
            <button onclick="selectOffer('${offer.id}', '${offer.owner.name}', '${offer.total_amount}')">Select</button>
        `;
        offersList.appendChild(listItem);
    });
}

// ✅ Book Flight
function bookFlight() {
    alert("Flight booking feature will be available soon!");
}
