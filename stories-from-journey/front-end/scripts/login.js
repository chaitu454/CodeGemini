import ApiService from "./api-base.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userData = await ApiService.login(email, password);

            // Store the user data in session storage
            sessionStorage.setItem("userEmail", email);
            sessionStorage.setItem("userToken", userData.token);

            alert("Login successful!");
            window.location.href = "home.html";
        } catch (error) {
            alert(`Login failed: ${error.message}`);
            console.error("Error:", error);
        }
    });
});