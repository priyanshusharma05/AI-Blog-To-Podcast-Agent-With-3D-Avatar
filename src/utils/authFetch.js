export const getAuthHeaders = (headers = {}) => {
    const token = localStorage.getItem('vc_token');
    return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const authFetch = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: getAuthHeaders(options.headers || {}),
    });
};
