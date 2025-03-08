import ApiService from "./api-base.js";

document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");

    forgotPasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const email = document.getElementById("email").value;

        try {
            // Call the API to get the security question for the provided email
            const result = await ApiService.getSecurityQuestion(email);

            // Check if the result is valid (i.e., contains a security question)
            if (result && result.security_question) {
                // Redirect to reset-password page, passing the email in the URL
                window.location.href = `reset-password.html?email=${email}`;
            } else {
                // If no security question found, alert the user
                alert("No security question found for this email address.");
            }
        } catch (error) {
            // Handle error (e.g., display an error message)
            alert(`Error fetching security question: ${error.message}`);
        }
    });
});