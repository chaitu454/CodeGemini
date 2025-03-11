import { LoginReqType, RegisterUserReqType, ResetPasswordReqType } from "./types";

const BASE_URL = "https://8000-kode-ws-9539fe779.hebbale.academy/api/users/";

export const loginUser = async (loginData: LoginReqType) => {
  let response
  try {
    const encodedCredentials = btoa(`${loginData.email}:${loginData.password}`);
    response = await fetch(`${BASE_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${encodedCredentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const result = await response!.json();
    const newError = new Error(result.message || "Unknown error occurred");
    (error as any).details = result;
    throw newError;
  }
};

export const getSecurityQuestion = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}${email}/security-question`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch security question: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error during getSecurityQuestion:", error);
    throw error;
  }
};

export const resetPassword = async (resetData: ResetPasswordReqType) => {
  try {
    const response = await fetch(`${BASE_URL}${resetData.email}/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetData),
    });
    if (!response.ok) {
      throw new Error(`Password reset failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error during resetPassword:", error);
    throw error;
  }
};

export const registerUser = async (userData: RegisterUserReqType) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during registerUser:", error);
    throw error;
  }
};

export const getUserList = async (email?: string) => {
  const token = localStorage.getItem("token");
  const url = email ? `${BASE_URL}${email}` : `${BASE_URL}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error("Error during getUserList:", error);
    throw error;
  }
};

export const editUserDetails = async (
  email: string,
  first_name: string,
  last_name: string,
  user_role: string
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ first_name, last_name, user_role }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw new Error(`${errorMessage}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (email: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}${email}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw new Error(`${errorMessage}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};