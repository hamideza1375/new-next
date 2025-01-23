import { SignModel } from '@/models/UserModel';
import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export default async function authMainAdminRoutes() {
    const cookieStore = cookies();
    return new Promise(async (resolve, reject) => {
        // دیکد کردن توکن های کاربر از کوکی ها
        const user = decode(cookieStore.get('token')?.value, { complete: true });
        const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });

        // بررسی اینکه آیا توکن ها معتبر هستند یا خیر
        if (!user || !httpUser) reject({ message: 'ابتدا وارد حساب خود شوید', status: 401 });
        // بررسی اینکه آیا کاربر ادمین است یا خیر
        if (!user.payload.isAdmin || !httpUser.payload.isAdmin) reject({ message: 'شما اجازه ی دسترسی ندارید', status: 403 });
        const usermodel = await SignModel.findById(httpUser.payload.userId);
        // بررسی اینکه آیا کاربر ادمین معتبر است یا خیر
        if (!usermodel?.isAdmin || usermodel?.isAdmin > 2) reject({ message: 'شما اجازه ی دسترسی ندارید', status: 403 });
      
        // بررسی حالت تاریک
        const mode = cookieStore.get('mode')?.value
        const parse = mode && JSON.parse(mode)
        if (!parse?.dark) return reject({ message: 'شما اجازه ی دسترسی ندارید', status: 403 });
      
        resolve(httpUser.payload);
    });
}
