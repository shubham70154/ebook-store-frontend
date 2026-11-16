import axiosInstance from "./axiosInstance";

export const processPayment = async (orderId, simulateFailure = false) => {
    const response = await axiosInstance.post(
        `/api/payments/${orderId}/process`,
        null,
        {
            params: {
                simulateFailure
            }
        }
    );

    return response.data;
};