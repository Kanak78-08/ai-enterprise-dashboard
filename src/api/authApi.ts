import axiosClient from "./axiosClient";
import type { LoginCredentials, User } from "../types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const response = await axiosClient.get(`/users?email=${credentials.email}`);
    
    if (!response.data || response.data.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = response.data[0];

    if (user.password !== credentials.password) {
      throw new Error("Invalid credentials");
    }

    const token = "mock-jwt-token-" + Math.random().toString(36).substring(7);

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
  
  signup: async (data: any): Promise<{ token: string; user: User }> => {
    // Check if email already exists
    const checkResponse = await axiosClient.get(`/users?email=${data.email}`);
    if (checkResponse.data && checkResponse.data.length > 0) {
      throw new Error("Email already registered");
    }

    const newUser = {
      ...data,
      role: "Viewer", // Default role
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    const response = await axiosClient.post(`/users`, newUser);
    const user = response.data;
    const token = "mock-jwt-token-" + Math.random().toString(36).substring(7);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
  
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await axiosClient.get(`/users?email=${email}`);
    
    if (!response.data || response.data.length === 0) {
      throw new Error("Email not found");
    }

    // Mock sending email
    return { message: "Password reset instructions sent to your email" };
  }
};
