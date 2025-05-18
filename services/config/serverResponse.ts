import Axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

type ServerResponseData = string | { message?: string } | any;

export const serverResponse = (): null => {
    const toastOK = (data: ServerResponseData): void => {
        toast.success(typeof data === 'string' ? data : 'موفق آمیز');
    };

    const toast400 = (error: ServerResponseData): void => {
        toast.error(typeof error === 'string' ? error : 'خطایی غیر منتظره رخ داد');
    };

    const toast401 = (error: ServerResponseData): void => {
        toast.error(typeof error === 'string' ? error : 'ابتدا وارد حساب خود شوید');
    };

    const toast404 = (): void => {
        toast.error('مسیر پیدا نشد');
    };

    const toast429 = (error: ServerResponseData): void => {
        const errorMessage = (typeof error === 'string' && error) || 
                          (typeof error === 'object' && typeof error?.message === 'string' && error.message) || 
                          'بیش از حد تلاش کردید';
        toast.error(errorMessage);
    };

    const otherErrors = (error: ServerResponseData): void => {
        toast.error(typeof error === 'string' ? error : 'مشکلی پیش آمد');
    };

    const toast500 = (): void => {
        toast.error('خطای سرور');
    };

    const toastServerError = (): void => {
        toast.warning('سرور در حال تعمیر');
    };
    
    Axios.interceptors.response.use(
        (response: AxiosResponse) => {
            const { status, config, data } = response;
            if (
                config.method !== 'get' &&
                (status === 200 || status === 201 || status === 'ok' || status === 'OK')
            ) {
                toastOK(data?.message);
            }
            return response;
        },
        (error: AxiosError) => {
            const { response, code } = error;
            
            if (!response?.status && error.request?.status === 0 && code === 'ERR_NETWORK') {
                toastServerError();
            } else if (response?.status) {
                switch(response.status) {
                    case 400:
                        toast400(response.data);
                        break;
                    case 401:
                    case 403:
                        toast401(response.data);
                        // window.location.href = '/';
                        // forbidden();
                        break;
                    case 404:
                        toast404();
                        break;
                    case 429:
                        toast429(response.data);
                        break;
                    case 500:
                        toast500();
                        break;
                    default:
                        otherErrors(response.data)
                        break;
                }
            }
            return Promise.reject(error);
        }
    );
    
    return null;
};