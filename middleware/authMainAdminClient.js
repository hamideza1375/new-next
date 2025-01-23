import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export default async function authMainAdminClient() {
    const cookieStore = cookies();
    // دریافت توکن از کوکی‌ها و رمزگشایی آن‌ها
    const user = decode(cookieStore.get('token')?.value, { complete: true });
    const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });
    // بررسی وجود توکن‌ها
    if (!user || !httpUser) return { error: true };
   
    // بررسی سطح دسترسی ادمین
    if ((!user.payload.isAdmin || user.payload.isAdmin > 2) || (!httpUser.payload.isAdmin || httpHttpUser.payload.isAdmin > 2)) return { error: true };
    
    // بررسی حالت تاریک
    const mode = cookieStore.get('mode')?.value
    const parse = mode && JSON.parse(mode)
    if (!parse?.dark) return { error: true };

    return { ok: true };
}
