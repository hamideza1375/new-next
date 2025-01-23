// حداکثر طول محتوا برای درخواست‌ها
const MAX_CONTENT_LENGTH = 2000500;
const MAX_CONTENT_LENGTH2 = 5000000;

export async function preventInvalidPhotos(request) {
    return new Promise(async (resolve) => {
        // بررسی نوع درخواست
        if (request.method === 'POST' || request.method === 'PUT') {
            // بررسی آدرس URL درخواست
            if (!request.url.includes("/dashboard") && !request.url.includes("/my-purchases")) {
                const contentLength = +request.headers.get('Content-Length');
                // اگر طول محتوا بیشتر از حداکثر مجاز باشد
                if (contentLength > MAX_CONTENT_LENGTH) {
                    resolve('MAX_LENGTH');
                }
            }
            // بررسی آدرس URL درخواست برای "/my-purchases"
            else if (request.url.includes("/my-purchases")) {
                const contentLength = +request.headers.get('Content-Length');
                // اگر طول محتوا بیشتر از حداکثر مجاز باشد
                if (contentLength > MAX_CONTENT_LENGTH2) {
                    resolve('MAX_LENGTH');
                }
            }
        }
        resolve()
    });
}
