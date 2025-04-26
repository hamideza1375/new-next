/**
 * میان‌افزار سمت کلاینت برای بررسی وضعیت احراز هویت کاربر
 * 
 * @async
 * @function authUserClient
 * @description این تابع وضعیت ورود/خروج کاربر را در سمت کلاینت با بررسی وجود توکن بررسی می‌کند.
 * مناسب برای استفاده در کامپوننت‌های React و شرایطی که نیاز به بررسی سریع وضعیت احراز هویت داریم.
 * 
 * @param {import("next/server").NextRequest} req - شیء درخواست
 * @returns {Promise<{ok: boolean} | {error: boolean}>} نتیجه بررسی وضعیت احراز هویت
 * 
 */
export default async function authUserClient(req) {
    if (req.cookies.get('token')?.value) return {ok:true} 
    if (req.cookies.get('httpToken')?.value) return {ok:true} 
    else return {error:true}
}
