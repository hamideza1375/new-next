import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';


export default async function authAdmin(req, res, next) {
    const cookieStore = cookies();
    const user = decode(cookieStore.get('token')?.value, { complete: true });
    const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });

    // موجود هستند httpUser بررسی اینکه آیا توکن‌های کاربر و
    if (!user || !httpUser) return res.json({ message: 'ابتدا وارد حسابتان شوید' }, { status: 401 });

    // ادمین هستند httpUser بررسی اینکه آیا کاربر و
    if (!user.payload.isAdmin || !httpUser.payload.isAdmin) return res.json({ message: 'شما اجازه ی دسترسی ندارید' }, { status: 403 });

    // مطابقت دارند httpUser بررسی اینکه آیا ایمیل‌های کاربر و
    if ((!user.payload.email || !httpUser.payload.email) && (user.payload.email !== httpUser.payload.email)) return res.json({ message: 'شما اجازه ی دسترسی ندارید' }, { status: 403 });

    // httpUser با اطلاعات 'user' تنظیم هدر
    next.headers.set('user', JSON.stringify(httpUser.payload));

    return next;
}
