import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export default async function authAdminClient() {
    const cookieStore = cookies(); // دریافت کوکی‌ها
    const user = decode(cookieStore.get('token')?.value, { complete: true }); // دیکد کردن توکن کاربر
    const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true }); // کاربر HTTP دیکد کردن توکن
    if (!user || !httpUser) return { error: true }; // بررسی وجود توکن‌ها
    if (!user.payload.isAdmin || !httpUser.payload.isAdmin) return { error: true }; // بررسی نقش ادمین
    return { ok: true }; // بازگشت نتیجه موفقیت‌آمیز
}
