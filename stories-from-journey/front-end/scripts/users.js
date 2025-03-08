import ApiService from "./api-base.js";

let user_role = "user";

// Function to fetch the user details (email and role) from the session storage
export async function fetchUserDetails() {
  const email = sessionStorage.getItem("userEmail");

  if (!email) {
    alert("No user email found in session storage. Redirecting back to login page...");
    window.location.href = "login.html";
  }

  try {
    // Call the API to fetch user details (email and role)
    const userDetails = await ApiService.getUserDetails(email);
    return userDetails;
  } catch (error) {
    alert(`Error fetching user details: ${error.message}`);
    window.location.href = "login.html";
  }
}

// Function to fetch the list of users
async function fetchUsersList() {
  try {
    const users = await ApiService.listAllUsers();
    return users;
  } catch (error) {
    alert(`Error fetching users list: ${error.message}`);
    return [];
  }
}

// Helper function to create a table cell that can be turned into an editable input field
function createTableCell(value, fieldName) {
  const cell = document.createElement("td");
  cell.setAttribute("data-field", fieldName);

  // Create a text node for regular display and an input for editing
  const textNode = document.createTextNode(value);

  // Initially, show the text content
  cell.appendChild(textNode);

  return cell;
}

// Function to switch a row to "edit" mode
function editUser(row) {
  const cells = row.querySelectorAll("td");
  const [_emailCell, firstNameCell, lastNameCell, userRoleCell, actionsCell] = cells;

  const firstNameValue = firstNameCell.textContent;
  const lastNameValue = lastNameCell.textContent;
  const userRoleValue = userRoleCell.textContent;
  const emailValue = _emailCell.textContent;

  const firstNameInput = document.createElement("input");
  firstNameInput.type = "text";
  firstNameInput.value = firstNameValue;

  const lastNameInput = document.createElement("input");
  lastNameInput.type = "text";
  lastNameInput.value = lastNameValue;

  firstNameCell.innerHTML = "";
  firstNameCell.appendChild(firstNameInput);

  lastNameCell.innerHTML = "";
  lastNameCell.appendChild(lastNameInput);

  if (user_role === "admin") {
    const userRoleSelect = document.createElement("select");
    const adminRoleOption = document.createElement("option");
    adminRoleOption.textContent = "admin";
    adminRoleOption.value = "admin";
    const userRoleOption = document.createElement("option");
    userRoleOption.textContent = "user";
    userRoleOption.value = "user";
    userRoleSelect.append(adminRoleOption);
    userRoleSelect.append(userRoleOption);
    userRoleSelect.value = userRoleValue;

    userRoleCell.innerHTML = "";
    userRoleCell.appendChild(userRoleSelect);
  }

  // Replace Edit button with Save and Cancel buttons
  actionsCell.innerHTML = "";

  const saveButton = document.createElement("button");
  saveButton.classList.add("action-btn", "save-btn");
  saveButton.textContent = "Save";
  saveButton.onclick = () => saveUser(row);

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("action-btn", "cancel-btn");
  cancelButton.textContent = "Cancel";
  cancelButton.onclick = () => cancelEdit(row, firstNameValue, lastNameValue, userRoleValue, emailValue);

  actionsCell.appendChild(saveButton);
  actionsCell.appendChild(cancelButton);
}

// Function to save user changes
async function saveUser(row) {
  const cells = row.querySelectorAll("td");
  const emailCell = cells[0];
  const firstNameCell = cells[1];
  const lastNameCell = cells[2];
  const userRoleCell = cells[3];

  const updatedUser = {
    first_name: firstNameCell.querySelector("input").value,
    last_name: lastNameCell.querySelector("input").value
  };

  if (user_role === "admin") {
    updatedUser.user_role = userRoleCell.querySelector("select").value;
  }

  try {
    // Call the save user API
    await ApiService.saveUserDetails(emailCell.textContent, updatedUser);
    alert("User details updated successfully");

    // Refresh the table with updated data
    const userDetails = await fetchUserDetails();
    user_role = userDetails.user_role;
    const users = await fetchUsersList();
    populateTable(users, user_role);
  } catch (error) {
    alert(`Error saving user details: ${error.message}`);
  }
}

// Function to cancel editing and revert the changes
function cancelEdit(row, originalFirstName, originalLastName, originalRole, originalEmail) {
  const cells = row.querySelectorAll("td");
  const [_emailCell, firstNameCell, lastNameCell, userRoleCell, actionsCell] = cells;

  firstNameCell.innerHTML = "";
  firstNameCell.textContent = originalFirstName;

  lastNameCell.innerHTML = "";
  lastNameCell.textContent = originalLastName;

  userRoleCell.innerHTML = "";
  userRoleCell.textContent = originalRole;

  // Restore the original action buttons
  const editButton = document.createElement("button");
  editButton.classList.add("action-btn", "edit-btn");
  editButton.textContent = "Edit";
  editButton.onclick = () => editUser(row);
  actionsCell.innerHTML = "";
  actionsCell.appendChild(editButton);
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("action-btn", "delete-btn");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => deleteUser(originalEmail);
  actionsCell.appendChild(deleteButton);
}

// Delete user logic
async function deleteUser(email) {
  try {
    // Call the delete user API
    if (confirm(`Do you want to delete this user: ${email}?`)) {
      await ApiService.deleteUser(email);
      alert("User details deleted successfully");

      // Refresh the table with updated data
      const userDetails = await fetchUserDetails();
      user_role = userDetails.user_role;
      const users = await fetchUsersList();
      populateTable(users, user_role);
    }
  } catch (error) {
    alert(`Error deleting user: ${error.message}`);
  }
}

// Page load logic
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch user details from session storage
  const userDetails = await fetchUserDetails();

  if (userDetails) {
    // Fetch the list of users
    const users = await fetchUsersList();
    user_role = userDetails.user_role;
    // Populate the table based on the user"s role
    populateTable(users, user_role);
  }
});


// Function to populate the users table
function populateTable(users, userRole) {
  const table = document.getElementById("usersTable");
  const tableBody = table.querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  users.forEach(user => {
    const row = document.createElement("tr");
    row.setAttribute("data-user-id", user.email); // Store user email in row for easy access

    // Create table cells for user information
    const emailCell = createTableCell(user.email, "email");
    const firstNameCell = createTableCell(user.first_name, "first_name");
    const lastNameCell = createTableCell(user.last_name, "last_name");
    const userRoleCell = createTableCell(user.user_role, "user_role");

    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.classList.add("action-btn", "edit-btn");
    editButton.textContent = "Edit";
    editButton.onclick = () => editUser(row);

    if (userRole === "admin") {
      actionsCell.appendChild(editButton);
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("action-btn", "delete-btn");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteUser(user.email);
      actionsCell.appendChild(deleteButton);
    } else if (userRole === "user" && user.email === sessionStorage.getItem("userEmail")) {
      // Only allow editing for the logged-in user if the role is "user"
      actionsCell.appendChild(editButton);
    }

    // Append cells to the row
    row.appendChild(emailCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(userRoleCell);
    row.appendChild(actionsCell);

    // Append row to the table
    tableBody.appendChild(row);
  });
}