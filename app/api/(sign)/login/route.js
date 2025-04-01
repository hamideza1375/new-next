import errorHandling from '@/middleware/errorHandling';
import rateLimit from '@/middleware/rateLimit';
import { UsersModel } from '@/models/UsersModel';
import jwt from 'jsonwebtoken';
import { NextResponse as res } from 'next/server';

export async function POST(req) {

    errorHandling(async () => {
        // دریافت داده‌های ارسالی از کلاینت
        const body = await req.json();
        const { email, password } = body;

        // جستجوی کاربر در دیتابیس بر اساس ایمیل
        // const user = await UsersModel.findOne({ email }).lean()
        const user = await UsersModel.findOne({ email }).select('-password').lean()

        // اگر کاربر وجود نداشته باشد، خطا بازگردانده شود
        if (!user)
            return res.json({ message: 'مشخصات اشتباه هست' }, { status: 400 });

        // استفاده از middleware محدودیت نرخ درخواست (Rate Limit)
        return rateLimit(async () => {
            // بررسی صحت رمز عبور
            await user.comparePassword(password);

            // اگر کاربر ادمین نباشد
            if (!user.isAdmin) {
                // ایجاد توکن برای کاربر عادی
                const forUserToken = {
                    ...user.sellerId && { sellerId: user.sellerId }, // اگر sellerId وجود داشته باشد، اضافه شود
                    username: user.username,
                    email: user.email,
                    products: user.products
                };

                // ایجاد توکن httpToken برای کوکی
                const httpToken = jwt.sign(
                    {
                        username: user.username,
                        userId: user._id,
                        email: user.email,
                        products: user.products,
                        ...user.sellerId && { sellerId: user.sellerId }
                    },
                    'httpToken'
                );
                cookieStore.set('httpToken', httpToken, { maxAge: 60 * 60 * 24 * 30, httpOnly: true });

                // ایجاد توکن اصلی برای کوکی
                const token = jwt.sign(forUserToken, 'token');
                cookieStore.set('token', token, { maxAge: 60 * 60 * 24 * 30 });

                // پاسخ موفقیت‌آمیز با توکن
                return res.json({ dt: token, message: {}, token: 'true' }, { status: 200 });
            }

            // اگر کاربر ادمین باشد، کد ارسال شود
            else if (user.isAdmin) {

                // const host = req.headers.host;
                // ارسال کد تأیید به ایمیل مدیر
                const response = await sendCode(email, req.url);

                // پاسخ با کد تأیید ارسال شده
                return res.json(response);
            }
        });
    })

}