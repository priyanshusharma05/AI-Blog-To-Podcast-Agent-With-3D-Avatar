// In production, VITE_API_URL points to the Render backend (e.g. https://your-app.onrender.com)
// In dev, it's empty so the Vite proxy handles /api/* requests.
const API_URL = import.meta.env.VITE_API_URL || '';

export const getAuthHeaders = (headers = {}) => {
    const token = localStorage.getItem('vc_token');
    return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const authFetch = (url, options = {}) => {
    return fetch(`${API_URL}${url}`, {
        ...options,
        headers: getAuthHeaders(options.headers || {}),
    });
};

export const apiFetch = (url, options = {}) => {
    return fetch(`${API_URL}${url}`, options);
};
