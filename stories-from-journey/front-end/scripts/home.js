import { fetchUserDetails } from './users.js';
// Redirect to login if not logged in
if (!sessionStorage.getItem("userEmail")) {
    window.location.href = "login.html";
}

// Function to show the selected page in the iframe
function showPage(page, element) {
    document.getElementById("contentFrame").src = page;
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    element.classList.add("active");
}

// Attach event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", function () {
            showPage(this.getAttribute("data-page"), this);
        });
    });


    // Fetch user details from session storage
    const userDetails = await fetchUserDetails();
    if (userDetails) {
        const userEmailField = document.getElementById("userEmail");
        userEmailField.textContent = `Email: ${userDetails.email}`;
    }

  // Handle the logout event
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "login.html"
  })
});
