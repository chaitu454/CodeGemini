import ApiService from "./api-base.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Get email from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");


  if (!email) {
    alert("No email provided in the query parameter.");
    return;
  }

  const emailField = document.getElementById("email");
  emailField.value = email;

  try {
    // Make a GET request to fetch the security question for the email
    const result = await ApiService.getSecurityQuestion(email);

    // Check if the result contains a valid security question
    if (result && result.security_question) {
      // Update the security question label with the fetched question
      const securityQuestion = document.getElementById("security-question");
      securityQuestion.value = result.security_question;
    } else {
      alert("Security question not found for this email.");
    }
  } catch (error) {
    alert(`Error fetching security question: ${error.message}`);
  }

  // Handle form submission
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const securityAnswer = document.getElementById("security-answer").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const data = {
      security_answer: securityAnswer,
      new_password: newPassword,
    };

    try {
      // Make a PUT request to reset the password
      const result = await ApiService.resetPassword(email, data);

      if (result && result.message === "Password reset successfully") {
        // Redirect to the login page or show success message
        alert("Password reset successful!");
        window.location.href = "login.html";
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      alert(`Error resetting password: ${error.message}`);
    }
  });
});
