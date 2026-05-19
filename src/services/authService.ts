import axios from "axios";
import type { LoginCredentials, User } from "../types";

const API_BASE_URL = "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      // Validate against mock data
      const response = await apiClient.get(`/users?email=${credentials.email}`);

      if (!response.data || response.data.length === 0) {
        throw new Error("User not found");
      }

      const user = response.data[0];

      if (user.password !== credentials.password) {
        throw new Error("Invalid password");
      }

      // Return user data without password
      return {
        id: user.id || credentials.email,
        email: user.email,
        name: user.name || credentials.email.split("@")[0],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const isNetworkError =
          !error.response ||
          error.code === "ECONNREFUSED" ||
          error.message.toLowerCase().includes("network error");

        if (isNetworkError) {
          // Fallback to hardcoded credentials if server is not running
          if (
            (credentials.email === "admin@test.com" ||
              credentials.email === "admin@demo.com") &&
            credentials.password === "password123"
          ) {
            return {
              id: "1",
              email: credentials.email,
              name: "Admin User",
            };
          }

          throw new Error(
            "Unable to reach the mock API. Start the server with `npm run server`, or use the demo credentials."
          );
        }
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  },
};

// Export axios instance for other API calls
export default apiClient;
