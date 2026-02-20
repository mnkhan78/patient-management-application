import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // backend URL
  withCredentials: true, // include cookies in requests
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 403) {
                window.location.href = "/forbidden";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
