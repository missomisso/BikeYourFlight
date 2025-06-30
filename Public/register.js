document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page refresh

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (data.success) {
        alert("Registration successful! Please log in.");
        window.location.href = "login.html"; // Redirect to login page
    } else {
        alert("Error: " + data.message);
    }
});