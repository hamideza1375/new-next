import errorHandling from '@/middleware/errorHandling';
import { checkCode } from '@/middleware/sendCode';
import { UsersModel } from '@/models/UsersModel';
import { SignUpValidator } from '@/validator/SignValidator';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';



/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {import('next/server').NextRequest} req 
 */

export async function POST(req) {
    return errorHandling(async () => {
        const cookieStore = await cookies();

        // اگر کاربر قبلاً وارد شده باشد، اجازه ثبت نام مجدد نده
        if (cookieStore.get('token') || cookieStore.get('httpToken'))
            return Response.json('شما در حال حاضر یک حساب فعال دارید', { status: 429 });

        // دریافت داده‌های ارسالی از کلاینت
        const body = await req.json();
        const { username, password, code } = body;

        // دریافت ایمیل از کوکی
        const email = cookieStore.get('email')?.value;

        // اگر ایمیل وجود نداشته باشد، خطا بازگردانده شود
        if (!email) return Response.json('لطفاً ابتدا کد تأیید را دریافت کنید', { status: 400 });

        // چک کردن همخوانی کد
        await checkCode(email, code)

        // اعتبارسنجی داده‌های ورودی
        SignUpValidator.validateSync({...body, email});
        await UsersModel.validate({...body, email});

        // بررسی تعداد کاربران موجود در دیتابیس
        const userLength = await UsersModel.countDocuments();

        // ایجاد کاربر جدید
        const user = new UsersModel({
            username: username,
            password: password,
            email: email
        });

        // اگر اولین کاربر باشد، آن را به عنوان ادمین تنظیم کن
        if (userLength === 0) {
            user.isAdmin = 1;
            await user.save();
        } else {
            await user.save();
        }

        // ایجاد توکن‌های JWT
        const forToken = {
            userId: user._id,
            username: user.username,
            email: user.email,
            products: []
        };

        const token = (secret)=> jwt.sign(forToken, secret);
        cookieStore.set('httpToken', token('httpToken'), { maxAge: 60 * 60 * 24 * 30, httpOnly: true });

        cookieStore.set('token', token('token'), { maxAge: 60 * 60 * 24 * 30 });

        // حذف زمان ارسال مجدد کد و کد تأیید از کوکی
        cookieStore.delete('ResendTime');
        cookieStore.delete('email');

        // پاسخ موفقیت‌آمیز
        return Response.json({ dt: token, message: 'ثبت نام با موفقیت انجام شد' },{ status: 201 });
    });
}