// وارد کردن مدل کاربر و توابع مورد نیاز
import { SignModel } from '@/models/UserModel';
import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// تابع اصلی برای احراز هویت کاربر
export default async function authUserRoutes() {
    // دریافت کوکی‌ها
    const cookieStore = cookies();
    return new Promise(async (resolve, reject) => {
        // دیکد کردن توکن‌ها از کوکی‌ها
        const user = decode(cookieStore.get('token')?.value, { complete: true });
        const httpToken = decode(cookieStore.get('httpToken')?.value, { complete: true });
        
        // بررسی وجود توکن‌ها
        if (!user?.payload || !httpToken?.payload)
            return reject({ message: 'ابتدا وارد حساب خود شوید', status: 401 });
        
        // پیدا کردن کاربر با استفاده از آی‌دی
        const usermodel = await SignModel.findById(httpToken.payload.userId);
        
        // بررسی نوع داده و وضعیت حساب کاربر
        if (typeof usermodel !== 'object') reject({ message: 'ابتدا وارد حساب خود شوید', status: 401 });
        if ((usermodel?.blocked)) reject({ message: 'حساب شما مسدود شده لطفا از طریق تیکت پیگیری کنید', status: 401 });
        
        // بازگرداندن اطلاعات توکن
        resolve(httpToken.payload);
    });
}
