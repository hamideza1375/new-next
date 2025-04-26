
/**
 * میان‌افزار سمت کلاینت برای بررسی وضعیت احراز هویت کاربر
 * 
 * @async
 * @function authSignClient
 * @description این تابع وضعیت ورود/خروج کاربر را در سمت کلاینت بررسی می‌کند.
 * با بررسی وجود توکن در کوکی‌ها، وضعیت احراز هویت کاربر را مشخص می‌نماید.
 * 
 * @param {import("next/server").NextRequest} req - شیء درخواست
 * @returns {Promise<{error: boolean} | {ok: boolean}>} نتیجه بررسی وضعیت احراز هویت
 */

export default async function authSignClient(req) {
    if (req.cookies.get('token')) return {error:true}
    if (req.cookies.get('httpToken')) return {error:true}
    else return {ok:true}
}
