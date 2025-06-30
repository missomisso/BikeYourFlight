

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Dashboard.js loaded and DOM is ready!");

    const airlineForm = document.getElementById("airline-form");

    if (!airlineForm) {
        console.error("❌ Error: Could not find #airline-form. Check if the ID is correct in dashboard.html.");
        return;
    }

    airlineForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // ✅ Prevent page reload

        console.log("✅ Form submitted! Starting API requests...");

        // Collect input values
        const airlineName = document.getElementById("airline-name").value;
        const iataCode = document.getElementById("iata-code").value;
        const icaoCode = document.getElementById("icao-code").value;
        const bicyclePolicy = document.getElementById("bicycle-policy").value;

        const maxWeight = document.getElementById("max-weight").value;
        const maxLength = document.getElementById("max-length").value;
        const maxWidth = document.getElementById("max-width").value;
        const maxHeight = document.getElementById("max-height").value;

        const responseMessage = document.getElementById("response-message");

        try {
            // ✅ Step 1: Create the Airline
            const airlineResponse = await fetch("/api/airlines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    AirlineName: airlineName,
                    IATA_Code: iataCode,
                    ICAO_Code: icaoCode,
                    BicyclePolicy: bicyclePolicy
                })
            });

            const airlineData = await airlineResponse.json();
            console.log("✅ Airline API Response:", airlineData);

            if (!airlineData.success) {
                responseMessage.textContent = "❌ Failed to create airline.";
                return;
            }

            const airlineID = airlineData.data.AirlineID; // Get Airline ID from response
            console.log("✅ Airline Created with ID:", airlineID);

            // ✅ Step 2: Add Bicycle Size Restrictions for the Airline
            const restrictionsResponse = await fetch("/api/restrictions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    AirlineID: airlineID,
                    MaxWeight: parseFloat(maxWeight),
                    MaxLength: parseFloat(maxLength),
                    MaxWidth: parseFloat(maxWidth),
                    MaxHeight: parseFloat(maxHeight)
                })
            });

            const restrictionsData = await restrictionsResponse.json();
            console.log("✅ Restrictions API Response:", restrictionsData);

            if (!restrictionsData.success) {
                responseMessage.textContent = "✅ Airline created, but failed to add restrictions.";
                return;
            }

            responseMessage.textContent = "✅ Airline and bicycle policy added successfully!";
            responseMessage.style.color = "green";

            // ✅ Clear Form Inputs
            airlineForm.reset();
        } catch (error) {
            console.error("❌ Error in API request:", error);
            responseMessage.textContent = "An error occurred. Please try again.";
        }
    });
});
