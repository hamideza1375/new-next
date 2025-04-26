import { decode } from 'jsonwebtoken';

/**
 * میان‌افزار سمت کلاینت برای احراز هویت فروشندگان
 *
 * @async
 * @description این تابع برای احراز هویت فروشندگان در سمت کلاینت استفاده می‌شود.
 * با بررسی توکن کاربر و وجود پراپرتی seller، وضعیت فروشنده بودن را بررسی می‌کند.
 *
 * @param {import("next/server").NextRequest} req - شیء درخواست حاوی کوکی‌ها
 * @returns {Promise<{error: boolean} | {ok: boolean}>} نتیجه احراز هویت
 */

export default async function authSellerClient(req) {
    const user = decode(req.cookies.get('token')?.value, 'token');
    if (!user?.seller) return { error: true };
    const httpUser = decode(req.cookies.get('httpToken')?.value, 'httpToken');
    if (!httpUser?.seller) return { error: true };
    else return { ok: true };
}
