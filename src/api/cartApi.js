import axiosInstance from "./axiosInstance";

export const getCart = async () => {
    const response = await axiosInstance.get("/api/cart");
    return response.data;
};

export const addCartItem = async (bookId, quantity = 1) => {
    const response = await axiosInstance.post("/api/cart/items", {
        bookId,
        quantity
    });
    return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
    const response = await axiosInstance.put(
        `/api/cart/items/${itemId}`,
        { quantity }
    );
    return response.data;
};

export const removeCartItem = async (itemId) => {
    await axiosInstance.delete(`/api/cart/items/${itemId}`);
};

export const clearCart = async () => {
    await axiosInstance.delete("/api/cart");
};