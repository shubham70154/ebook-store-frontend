
import axiosInstance from "./axiosInstance";

export const processPayment = async (orderId, paymentMethod) => {
    const response = await axiosInstance.post(
        `/api/payments/${orderId}/process`,
        {
            paymentMethod
        }
    );

    return response.data;
};
