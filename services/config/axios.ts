import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// تنظیمات پیش‌فرض Axios
Axios.defaults.headers.post['Content-Type'] = 'application/json';

const instance: AxiosInstance = Axios.create({
    baseURL: '/api'
});

interface ApiResponse<T = any> {
    data: T;
    status?: number;
}

class ApiClient {
    constructor() {
        this.initializeMethods();
    }

    private async initializeMethods() {
        // این متد برای سازگاری با کد اصلی نگه داشته شده
    }

    public async get<T = any>(url: string): Promise<ApiResponse<T>> {
        const response: AxiosResponse<T> = await instance.get(url);
        return { data: response?.data, status: response?.status };
    }

    public async post<T = any>(url: string, data?: any, options?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response: AxiosResponse<T> = await instance.post(url, data, options);
        return { data: response?.data, status: response?.status };
    }

    public async put<T = any>(url: string, data?: any, options?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response: AxiosResponse<T> = await instance.put(url, data, options);
        return { data: response?.data, status: response?.status };
    }

    public async delete<T = any>(url: string): Promise<ApiResponse<T>> {
        const response: AxiosResponse<T> = await instance.delete(url);
        return { data: response?.data, status: response?.status };
    }

    public async postFile<T = any>(url: string, data: Record<string, any>): Promise<ApiResponse<T>> {
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        const response: AxiosResponse<T> = await instance.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return { data: response.data, status: response.status };
    }

    public async putFile<T = any>(url: string, data: Record<string, any>): Promise<ApiResponse<T>> {
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        const response: AxiosResponse<T> = await instance.put(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return { data: response.data, status: response.status };
    }
}

export const axios = new ApiClient();

//////////////////////////!

const baseUrl: string = 'http://localhost:3000/api';

interface FetchResponse<T = any> {
    status: number;
    statusText: string;
    method?: string;
    data: T;
}

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

class FetchClient {
    public async get<T = any>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
        const response = await fetch(baseUrl + url, options);
        return {
            status: response.status,
            statusText: response.statusText,
            method: 'GET',
            data: await response.json()
        };
    }

    public async post<T = any>(url: string, data?: any, options?: FetchOptions): Promise<FetchResponse<T>> {
        const response = await fetch(baseUrl + url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        });
        return {
            status: response.status,
            statusText: response.statusText,
            method: 'POST',
            data: await response.json()
        };
    }

    public async put<T = any>(url: string, data?: any, options?: FetchOptions): Promise<FetchResponse<T>> {
        const response = await fetch(baseUrl + url, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        });
        return {
            status: response.status,
            statusText: response.statusText,
            method: 'PUT',
            data: await response.json()
        };
    }

    public async delete<T = any>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
        const response = await fetch(baseUrl + url, { 
            method: 'DELETE', 
            ...options 
        });
        return {
            status: response.status,
            statusText: response.statusText,
            method: 'DELETE',
            data: await response.json()
        };
    }

    public async postFile<T = any>(url: string, data: Record<string, any>, options?: FetchOptions): Promise<FetchResponse<T>> {
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        const response = await fetch(baseUrl + url, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            ...options
        });
        return {
            status: response.status,
            statusText: response.statusText,
            method: 'POST',
            data: await response.json()
        };
    }

    public async putFile<T = any>(url: string, data: Record<string, any>, options?: FetchOptions): Promise<FetchResponse<T>> {
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        const response = await fetch(baseUrl + url, {
            method: 'PUT',
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            ...options
        });
        return {
            status: response.status,
            statusText: response.statusText,
            method: 'PUT',
            data: await response.json()
        };
    }
}

export const Fetch = new FetchClient();