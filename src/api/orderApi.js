import axiosInstance from "./axiosInstance";

export const createOrder = async (idempotencyKey) => {
    const response = await axiosInstance.post(
        "/api/orders/checkout",
        {},
        {
            headers: {
                "Idempotency-Key": idempotencyKey
            }
        }
    );

    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await axiosInstance.get(`/api/orders/${orderId}`);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axiosInstance.get("/api/orders");
    return response.data;
};