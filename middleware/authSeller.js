import { UsersModel } from '@/models/UsersModel';
import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export default async function authSeller() {
    // دریافت کوکی‌ها
    const cookieStore = cookies();
    return new Promise(async (resolve, reject) => {
        // دیکد کردن توکن‌ها از کوکی‌ها
        const user = decode(cookieStore.get('token')?.value, { complete: true });
        const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });
        
        // بررسی وجود توکن‌ها
        if (!user || !httpUser) reject({ message: 'ابتدا وارد حساب خود شوید', status: 401 });
        
        // پیدا کردن کاربر در دیتابیس با استفاده از آی‌دی
        const UserModel = await UsersModel.findById(httpUser.payload.userId);
        
        // بررسی اینکه کاربر فروشنده است یا خیر
        if (!UserModel?.sellerId) reject({ message: 'شما اجازه ی دسترسی ندارید', status: 403 });
        
        // بازگرداندن اطلاعات کاربر
        resolve(httpUser.payload);
    });
}
