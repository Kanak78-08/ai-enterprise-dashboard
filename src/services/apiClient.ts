import axios from "axios";

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: "http://localhost:3001", // Assuming json-server is running on port 3001
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptors (e.g., for auth tokens)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
