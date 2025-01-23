import Axios from 'axios';
// import { forbidden } from 'next/navigation';
import { toast } from 'react-toastify';

export const serverResponse = () => {
    var toastOK = data => {
        toast.success(typeof data === 'string' ? data : 'موفق آمیز');
    };
    var toast400 = error => {
        toast.error(typeof error === 'string' ? error : 'خطایی غیر منتظره رخ داد');
    };
    var toast401 = error => {
        toast.warning(typeof error === 'string' ? error : 'عدم دسترسی');
    };
    var toast404 = () => {
        toast.error('مسیر پیدا نشد');
    };
    var toast500 = () => {
        toast.error('خطا ی سرور', 'مشکلی از سمت سرور پیش آمده');
    };
    var toastServerError = () => {
        toast.warning('سرور در حال تعمیر', 'لطفا چند دقیقه دیگر امتحان کنید');
    };
    Axios.interceptors.response.use(
        function (response) {
            const {
                status,
                config,
                data,
            } = response;
            if (
                config.method !== 'get' &&
                (status === 200 || status === 201 || status === 'ok' || status === 'OK')
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
                    // window.location.href = '/';
                    // forbidden();
                } else if (response.status === 404) {
                    toast404();
                } else if (response.status > 404 && response.status <= 500) {
                    toast500();
                }
            }
            return Promise.reject(error);
        }
    );
    return null;
};
