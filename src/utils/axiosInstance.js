import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // You can add other default settings here (e.g., headers) if needed.
});

export default axiosInstance;
