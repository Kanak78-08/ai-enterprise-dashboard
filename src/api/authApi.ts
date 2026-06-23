import axiosClient from "./axiosClient";
import type { LoginCredentials, User } from "../types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    // Since json-server doesn't natively support POST /auth/login for JWT,
    // we simulate the backend logic here by fetching the user and generating a mock token.
    const response = await axiosClient.get(`/users?email=${credentials.email}`);
    
    if (!response.data || response.data.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = response.data[0];

    if (user.password !== credentials.password) {
      throw new Error("Invalid credentials");
    }

    const token = "mock-jwt-token-" + Math.random().toString(36).substring(7);

    // Return the required shape
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "Viewer",
      },
    };
  },
};
