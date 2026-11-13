import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach authentication credentials to API requests.
axiosInstance.interceptors.request.use((config) => {

    const authHeader = sessionStorage.getItem("authHeader");

    if (authHeader) {
        config.headers.Authorization = authHeader;
    }

    return config;
});

export default axiosInstance;