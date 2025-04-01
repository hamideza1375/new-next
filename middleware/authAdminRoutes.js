import { UsersModel } from '@/models/UsersModel';
import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// تابع پیش‌فرض برای احراز هویت مسیرهای ادمین
export default async function authAdminRoutes() {
    // دریافت کوکی‌ها
    const cookieStore = cookies();
    return new Promise(async (resolve, reject) => {
        // دیکد کردن توکن‌های کاربر
        const user = decode(cookieStore.get('token')?.value, { complete: true });
        const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });

        // بررسی وجود توکن‌ها
        if (!user || !httpUser) reject({ message: 'ابتدا وارد حساب خود شوید', status: 401 });
        // بررسی دسترسی ادمین
        if (!user.payload.isAdmin || !httpUser.payload.isAdmin) reject({ message: 'شما اجازه ی دسترسی ندارید', status: 403 });
        // یافتن کاربر در پایگاه داده
        const UserModel = await UsersModel.findById(httpUser.payload.userId);
        // بررسی دسترسی ادمین در پایگاه داده
        if (!UserModel?.isAdmin) reject({ message: 'شما اجازه ی دسترسی ندارید', status: 403 });
        // تایید دسترسی
        resolve(httpUser.payload);
    });
}
