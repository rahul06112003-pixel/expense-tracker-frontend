const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });

  const data = await response.json();

 if (!response.ok) {
  const error = new Error(data.message || "Something went wrong");
  error.status = response.status;
  throw error;
 }

  return data;
}

export default apiRequest;