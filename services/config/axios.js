import Axios from 'axios';
// import { forbidden } from 'next/navigation';
import { toast } from 'react-toastify';
Axios.defaults.headers.post['Content-Type'] = 'application/json';

const instance = Axios.create({
    baseURL: '/api'
});

export const serverResponse = () => {
    let toastOK = data => {
        toast.success(((typeof data === 'string' && data) || (typeof data?.message === 'string' && data.message)) || 'موفق آمیز');
    };
    let toast400 = error => {
        toast.error(((typeof error === 'string' && error) || (typeof error?.message === 'string' && error.message)) || 'خطایی غیر منتظره رخ داد');
    };
    let toast401 = error => {
        toast.error(((typeof error === 'string' && error) || (typeof error?.message === 'string' && error.message)) || 'شما اجازه دسترسی ندارید');
    };
    let toast404 = () => {
        toast.error('مسیر پیدا نشد');
    };
    let toast429 = error => {
        toast.error(((typeof error === 'string' && error) || (typeof error?.message === 'string' && error.message)) || 'بیش از حد تلاش کردید');
    };
    let otherErrors = error => {
        toast.error(((typeof error === 'string' && error) || (typeof error?.message === 'string' && error.message)) || 'مشکلی پیش آمد');
    };
    let toast500 = (error) => {
        toast.error(((typeof error === 'string' && error) || (typeof error?.message === 'string' && error.message)) || 'خطایی از سمت سرور رخ داد');
    };
    let toastServerError = () => {
        toast.warning('سرور در حال تعمیر', 'لطفا چند دقیقه دیگر امتحان کنید');
    };
    instance.interceptors.response.use(
        function (response) {
            const { status, config, data } = response;
            if (
                config.method !== 'get' &&
                ((status === 200 || status === 201 || status === 'ok' || status === 'OK') && status !== 206 )
            )
                toastOK(data?.message);
            return response;
        },
        function (error) {
            const { response = {} } = error;
            if (!response.status && error['request']?.status === 0 && error.code === 'ERR_NETWORK') {
                toastServerError();
            } else if (response?.status) {
                if (response.status === 400 && response.data) {
                    toast400(response.data);
                } else if (response.status === 401) {
                    toast401(response.data);
                } else if (response.status === 403) {
                    toast401(response.data);
                    // forbidden();
                } else if (response.status === 404) {
                    toast404();
                } else if (response.status === 429) {
                    toast429(response.data);
                } else if (response.status > 404 && response.status <= 429) {
                    otherErrors(response.data);
                } else if (response.status > 429 && response.status <= 500) {
                    toast500();
                }
            }
            return Promise.reject(error);
        }
    );
    return null;
};

function _axios() {
    (async () => {
        this.get = async url => {
            let response = await instance.get(url);
            return { data: response?.data, status: response?.status };
        };
        this.post = async (url, data, options) => {
            let response = await instance.post(url, data, options);
            return { data: response?.data, status: response?.status };
        };
        this.put = async (url, data, options) => {
            let response = await instance.put(url, data, options);
            return { data: response?.data, status: response?.status };
        };
        this.delete = async url => {
            let response = await instance.delete(url);
            return { data: response?.data, status: response?.status };
        };

        this.postFile = async (url, data) => {
            const dt = new FormData();
            for (let i in data) {
                dt.append(String(i), data[i]);
            }
            let response = await instance.post(url, dt, { headers: { 'Content-Type': 'multipart/form-data' } });
            return { data: response.data, status: response.status };
        };

        this.putFile = async (url, data) => {
            const dt = new FormData();
            for (let i in data) {
                dt.append(String(i), data[i]);
            }
            let response = await instance.put(url, dt, { headers: { 'Content-Type': 'multipart/form-data' } });
            return { data: response.data, status: response.status };
        };
    })();
}
export const axios = new _axios();

//////////////////////////!

//////////////////////////!
export const baseUrl = 'http://localhost:3000/api';

function _Fetch() {
    this.get = (url, option) =>
        fetch(baseUrl + url, option).then(async res => ({
            status: res.status,
            statusText: res.statusText,
            method: 'GET',
            data: await res.json()
        }));

    this.post = (url, data, options) =>
        fetch(baseUrl + url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        }).then(async res => ({
            status: res.status,
            statusText: res.statusText,
            method: 'POST',
            data: await res.json()
        }));

    this.put = (url, data, options) =>
        fetch(baseUrl + url, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        }).then(async res => ({
            status: res.status,
            statusText: res.statusText,
            method: 'PUT',
            data: await res.json()
        }));

    this.delete = (url, options) =>
        fetch(baseUrl + url, { method: 'DELETE', ...options }).then(async res => ({
            status: res.status,
            statusText: res.statusText,
            method: 'DELETE',
            data: await res.json()
        }));

    this.postFile = async (url, data, ...options) => {
        const dt = new FormData();
        for (let i in data) {
            dt.append(String(i), data[i]);
        }
        let response = await fetch(baseUrl + url, {
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'multipart/form-data' },
            ...options
        });
        return {
            status: response.status,
            statusText: response.statusText,
            method: 'POST',
            data: await response.json()
        };
    };

    this.putFile = async (url, data, ...options) => {
        const dt = new FormData();
        for (let i in data) {
            dt.append(String(i), data[i]);
        }
        let response = await fetch(baseUrl + url, {
            method: 'PUT',
            body: data,
            method: 'PUT',
            headers: { 'Content-Type': 'multipart/form-data' },
            ...options
        });
        return {
            status: response.status,
            statusText: response.statusText,
            data: await response.json()
        };
    };
}

export const Fetch = new _Fetch();
