import axiosInstance from "./axiosInstance";

export const getAllBooks = async () => {
    const response = await axiosInstance.get("/api/books");
    return response.data;
};

export const searchBooks = async (keyword) => {
    const response = await axiosInstance.get("/api/books/search", {
        params: { keyword }
    });
    return response.data;
};

export const getBookById = async (id) => {
    const response = await axiosInstance.get(`/api/books/${id}`);
    return response.data;
};