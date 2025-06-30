document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page refresh

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
        alert("Login successful!");

        // ✅ Store JWT token in localStorage
        localStorage.setItem("authToken", data.token);

        // ✅ Redirect to the dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Error: " + data.message);
    }
});
