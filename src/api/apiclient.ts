import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

// Ortak axios instance
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_PATH || "",
    withCredentials: true,
});

// Request interceptor: Authorization + X-Tenant-Id
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    try {
        const headers = (config.headers ?? new AxiosHeaders()) as AxiosHeaders;
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        } else {
            headers.delete("Authorization");
        }
        const tenantId = localStorage.getItem("selectedTenantId");
        if (tenantId && tenantId !== "null" && tenantId !== "undefined") {
            headers.set("X-Tenant-Id", tenantId);
        } else {
            headers.delete("X-Tenant-Id"); // global modda header yok
        }
        config.headers = headers;
    } catch { }
    return config;
});

let lastValidateAt = 0;
const VALIDATE_TTL_MS = 5 * 60 * 1000; // 5 dk

// Response interceptor: 401/403 halinde tekil validasyon ve logout
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            const now = Date.now();
            if (now - lastValidateAt > VALIDATE_TTL_MS) {
                lastValidateAt = now;
                try {
                    const token = localStorage.getItem("accessToken");
                    await axios.get(`${process.env.REACT_APP_BASE_PATH || ""}/api/User/validatetokenAndUser`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    });
                } catch (e) {
                    localStorage.removeItem("accessToken");
                    window.location.href = "/authentication/sign-in/cover";
                    return;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
