import apiRequest from "./api";

export async function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

export async function getCurrentUser() {
  return apiRequest("/auth/me");
}


export async function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}


export async function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}