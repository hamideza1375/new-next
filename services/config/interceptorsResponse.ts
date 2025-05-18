import { toast } from 'react-toastify';

interface ResponseData {
    message?: string;
    [key: string]: any;
}

interface ErrorResponse {
    status: number;
    data: ResponseData | string;
    method?: string;
    message?: string;
}

const toastOK = (data: ResponseData | string): void => {
    toast.success(
        (typeof data === 'string' && data) || 
        (typeof (data as ResponseData)?.message === 'string' && (data as ResponseData).message) || 
        'موفق آمیز'
    );
};

const toast400 = (error: ResponseData | string): void => {
    toast.error(
        (typeof error === 'string' && error) ||
        (typeof (error as ResponseData)?.message === 'string' && (error as ResponseData).message) ||
        'خطایی غیر منتظره رخ داد'
    );
};

const toast401 = (error: ResponseData | string): void => {
    toast.error(
        (typeof error === 'string' && error) ||
        (typeof (error as ResponseData)?.message === 'string' && (error as ResponseData).message) ||
        'عدم دسترسی'
    );
};

const toast404 = (): void => {
    toast.error('مسیر پیدا نشد');
};

const toast429 = (error: ResponseData | string): void => {
    toast.error(
        (typeof error === 'string' && error) ||
        (typeof (error as ResponseData)?.message === 'string' && (error as ResponseData).message) ||
        'بیش از حد تلاش کردید')
};

const otherErrors = (error: ResponseData | string): void => {
    toast.error(typeof error === 'string' ? error : 'مشکلی پیش آمد');
};

const toast500 = (): void => {
    toast.error('مشکلی از سمت سرور پیش آمده');
};

const toastServerError = (): void => {
    toast.warning('لطفا چند دقیقه دیگر امتحان کنید');
};

async function errorHandeling({ status, data }: { status: number; data: ResponseData | string }): Promise<void> {
    switch (status) {
        case 400:
            toast400(data);
            break;
        case 401:
        case 403:
            toast401(data);
            break;
        case 404:
            toast404();
            break;
        case 429:
            toast429(data);
            break;
        case 500:
            toast500();
            break;
        default:
            otherErrors(data);
    }
}




/**
 * @example const example = async (value: any) => {
 const {status, data} = await interceptorsResponse(handelSendComment('params.id', { star: 'rating', ...value }));
 status <= 201 && '...'
 };
 */
export default function interceptorsResponse(call: Promise<any>): Promise<{ status: number; data: any }> {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, statusText, data, method } = await call;
            if (status === 200 || status === 201 || statusText === 'OK') {
                toastOK(data);
                resolve({ status, data });
            } else {
                if (method !== 'GET') {
                    await errorHandeling({ status, data });
                }
                console.log({ status, data, method });
                reject({ status, data, method });
            }
        } catch (error: unknown) {
            const err = error as ErrorResponse;
            if (err?.message === 'Failed to fetch') {
                toastServerError();
                return;
            }
            console.log(error);
            if (err.method !== 'GET') {
                errorHandeling(err);
            }
        }
    });
}