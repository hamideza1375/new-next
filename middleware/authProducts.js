import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';


export default async function authProducts(req, res, next) {
    return new Promise((resolve)=>{
        const cookieStore = cookies();
        // دریافت توکن کاربر از کوکی‌ها
        const user = decode(cookieStore.get('token')?.value, { complete: true });
        const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });
        // وجود نداشته باشد httpUser اگر توکن
        if (!httpUser) return resolve()
        // اگر توکن user وجود نداشته باشد
        if (!user) return resolve()
        // بررسی تطابق ایمیل‌ها
        if (user.payload.email !== httpUser.payload.email) return resolve()
        // بررسی تطابق وضعیت ادمین بودن
        if ((user.payload.isAdmin || httpUser.payload.isAdmin) && user.payload.isAdmin !== httpUser.payload.isAdmin) return resolve()
        // بررسی تطابق ایمیل‌ها در صورت ادمین بودن
        if ((user.payload.isAdmin || httpUser.payload.isAdmin) && user.payload.email !== httpUser.payload.email) return resolve()
        // اگر user ادمین باشد و httpUser ادمین نباشد
        if (user.payload.isAdmin && !httpUser.payload.isAdmin) return resolve()
        // تنظیم هدر کاربر
        next.headers.set('user', JSON.stringify(httpUser.payload));
        resolve()
})
}
