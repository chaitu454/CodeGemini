const BASE_URL = "https://7071-kode-ws-c77ea2689.hebbale.academy/api/users"

const ApiService = {
    // Methods will be added in the future steps
    async register(formData) {
        const headers = new Headers({
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL + "", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Register failed");
        }
        return await response.json();
    },
    async login(email, password) {
        if (!email || !password) {
            throw new Error("Login failed");
        }
        const headers = new Headers({
            "Authorization": "Basic "+btoa(email+":"+password),
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL + "/login", {
            method: "POST",
            headers: headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Login failed");
        }
        const data = await response.json();
        return data;
    },
    async getSecurityQuestion(email) {
        if (!email) {
            throw new Error("Failed to get security question");
        }
        const headers = new Headers({
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL +"/"+ email+"/security-question", {
            method: "GET",
            headers: headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch user security question");
        }
        const data = await response.json();
        return data;
    },
    async resetPassword(email, formData) {
        if (!email) {
            throw new Error("Reset password failed");
        }
        const headers = new Headers({
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL +"/"+ email+"/reset-password", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to reset password");
        }
        return await {
            message: "Password reset successfully"
        };
    },
    async getUserDetails(email) {
        if (!email) {
            throw new Error("Failed to get user details");
        }
        const authToken = sessionStorage.getItem("userToken");
        if(!authToken){
            throw new Error("Missing Authorization Token!!! Please login again.");
        }
        const headers = new Headers({
            "Authorization": "Bearer "+ authToken,
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL +"/"+ email, {
            method: "GET",
            headers: headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch user details");
        }
        const data = await response.json();
        const users = data.users;
        return users[0];
    },
    async listAllUsers() {

        const authToken = sessionStorage.getItem("userToken");
        if(!authToken){
            throw new Error("Missing Authorization Token!!! Please login again.");
        }
        const headers = new Headers({
            "Authorization": "Bearer "+ authToken,
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL + "", {
            method: "GET",
            headers: headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch users");
        }
        const data = await response.json();
        const users = data.users;
        return users;
    },
    async saveUserDetails(email, formData) {
        if (!email) {
            throw new Error("Update user failed");
        }
        const authToken = sessionStorage.getItem("userToken");
        if(!authToken){
            throw new Error("Missing Authorization Token!!! Please login again.");
        }
        const headers = new Headers({
            "Authorization": "Bearer "+ authToken,
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL + "/"+email, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Update User failed");
        }
        return;
    },
    async deleteUser(email, formData) {
        if (!email) {
            throw new Error("Unable to delete the user");
        }
        const authToken = sessionStorage.getItem("userToken");
        if(!authToken){
            throw new Error("Missing Authorization Token!!! Please login again.");
        }
        const headers = new Headers({
            "Authorization": "Bearer "+ authToken,
            "Content-Type": "application/json",
        });
        const response = await fetch(BASE_URL +"/"+ email, {
            method: "DELETE",
            headers: headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete user details");
        }
        return;
    },
};

export default ApiService;