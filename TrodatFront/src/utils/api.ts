import axios from "axios";
import { isDev } from './constants';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure`;
};

const getCookie = (name: string) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const api = axios.create({
    baseURL: isDev ? 'http://localhost:8080/api' : 'http://localhost:8080/api',
    responseType: 'json'
});

export const imageurl = 'http://localhost:8080/'

// Request interceptor to include JWT token
api.interceptors.request.use(
    config => {
        const token = getCookie('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getCookie('refreshToken');
            return new Promise((resolve, reject) => {
                axios.post('/customer/refresh', { token: refreshToken })
                    .then(({ data }) => {
                        setCookie('accessToken', data.accessToken, 1); // Expires in 1 day
                        setCookie('refreshToken', data.refreshToken, 7); // Expires in 7 days
                        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
                        processQueue(null, data.accessToken);
                        resolve(axios(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null); // Pass null as token in case of an error
                        reject(err);
                    })
                    .finally(() => { isRefreshing = false; });
            });
        }
        return Promise.reject(error);
    }
);
