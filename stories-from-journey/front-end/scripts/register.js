import ApiService from "./api-base.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Gather form data
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return; // Stop further processing if passwords don"t match
        }

        const formData = {
            first_name: document.getElementById("first-name").value,
            last_name: document.getElementById("last-name").value,
            email: document.getElementById("email").value,
            password,
            security_question: document.getElementById("security-question").value,
            security_answer: document.getElementById("security-answer").value,
        };

        try {
            // Call the API
            const result = await ApiService.register(formData);

            // Handle success (e.g., redirect to another page or display a success message)
            alert("Registration successful!");
            console.log("Registration Result:", result);

            // Example: Redirect to login page
            window.location.href = "login.html";
        } catch (error) {
            // Handle error (e.g., display an error message)
            alert(`Registration failed: ${error.message}`);
        }
    });
});