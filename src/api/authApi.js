
import axiosInstance from "./axiosInstance";

// Register a new customer
export const registerUser = async (userData) => {
    const response = await axiosInstance.post(
        "/api/auth/register",
        userData
    );

    return response.data;
};

// Get currently authenticated user
export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/api/auth/me");

    return response.data;
};
