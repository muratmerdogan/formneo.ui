import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

// Request: Authorization + X-Tenant-Id
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    try {
        const headers = (config.headers ?? new AxiosHeaders()) as AxiosHeaders;
        const token = localStorage.getItem("accessToken");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        else headers.delete("Authorization");

        const tenantId = localStorage.getItem("selectedTenantId");
        if (tenantId && tenantId !== "null" && tenantId !== "undefined") headers.set("X-Tenant-Id", tenantId);
        else headers.delete("X-Tenant-Id");

        config.headers = headers;
    } catch { }
    return config;
});

let lastValidateAt = 0;
const VALIDATE_TTL_MS = 5 * 60 * 1000; // 5 dk

// Response: 401/403 → validate then redirect if invalid
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const path = typeof window !== 'undefined' ? (window.location.pathname || '') : '';
        const isAuthRoute = path.startsWith('/authentication');
        const isUnauthorizedRoute = path.startsWith('/NotAuthorization');
        const reqUrl: string = (error?.config?.url as string) || '';
        // Login sayfasında veya doğrulama çağrısında loop'u engelle
        if (isAuthRoute || reqUrl.includes('/api/User/validatetokenAndUser')) {
            return Promise.reject(error);
        }
        // 403: Yetkisiz → NotAuthorization'a yönlendir
        if (status === 403) {
            if (!isUnauthorizedRoute) {
                window.location.href = '/NotAuthorization';
                return;
            }
            return Promise.reject(error);
        }
        // 401: Kimlik gerekli → doğrula, olmazsa login'e yönlendir
        if (status === 401) {
            const now = Date.now();
            if (now - lastValidateAt > VALIDATE_TTL_MS) {
                lastValidateAt = now;
                try {
                    const token = localStorage.getItem('accessToken');
                    await axios.get(`${process.env.REACT_APP_BASE_PATH || ''}/api/User/validatetokenAndUser`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    });
                } catch {
                    localStorage.removeItem('accessToken');
                    if (!isAuthRoute) {
                        window.location.href = '/authentication/sign-in/cover';
                    }
                    return;
                }
            }
        }
        return Promise.reject(error);
    }
);


