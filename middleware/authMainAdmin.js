import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export default async function authMainAdmin(req, res, next) {
    const cookieStore = cookies();
    // دریافت توکن کاربر از کوکی‌ها
    const user = decode(cookieStore.get('token')?.value, { complete: true });
    const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });
    // بررسی وجود توکن‌ها
    if (!user || !httpUser) return res.json({ message: 'ابتدا وارد حسابتان شوید' }, { status: 401 });

    // بررسی سطح دسترسی ادمین
    if ((!user.payload.isAdmin || user.payload.isAdmin > 2) || (!httpUser.payload.isAdmin || httpUser.payload.isAdmin > 2)) return res.json({ message: 'شما اجازه ی دسترسی ندارید' }, { status: 403 });
    // بررسی تطابق ایمیل‌ها
    if ((!user.payload.email || !httpUser.payload.email) && (user.payload.email !== httpUser.payload.email)) return res.json({ message: 'شما اجازه ی دسترسی ندارید' }, { status: 403 });

    // بررسی حالت تاریک
    const mode = cookieStore.get('mode')?.value
    const parse = mode && JSON.parse(mode)
    if (!parse?.dark) return res.json({ message: 'شما اجازه ی دسترسی ندارید' }, { status: 403 });
   
    // تنظیم هدر کاربر
    next.headers.set('user', JSON.stringify(httpUser.payload));

    return next;
}
