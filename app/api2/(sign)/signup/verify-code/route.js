import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse as res } from 'next/server';

import errorHandling from '@/middleware/errorHandling';
import { SignModel } from '@/models/SignModel';
import { SignUpValidator } from '@/validator/SignValidator';
import cache from '@/utils/node_cache.js';

export async function POST(req) {
    return errorHandling(async () => {
        const cookieStore = cookies();

        // اگر کاربر قبلاً وارد شده باشد، اجازه ثبت نام مجدد نده
        if (cookieStore.get('token')) {
            return res.json('شما در حال حاضر یک حساب فعال دارید', { status: 429 });
        }

        // دریافت داده‌های ارسالی از کلاینت
        const body = await req.json();
        const { username, password, code } = body;

        // دریافت ایمیل از کوکی
        const email = cookieStore.get('email')?.value;

        // اگر ایمیل وجود نداشته باشد، خطا بازگردانده شود
        if (!email) {
            return res.json('لطفاً ابتدا کد تأیید را دریافت کنید', { status: 400 });
        }

        // بررسی صحت کد تأیید
        if (cache.get('code' + email) != code) {
            return res.json('کد وارد شده اشتباه هست', { status: 400 });
        }

        // اعتبارسنجی داده‌های ورودی
        SignUpValidator.validateSync(body);
        await SignModel.validate(body);

        // بررسی تعداد کاربران موجود در دیتابیس
        const userLength = await SignModel.countDocuments();

        // ایجاد کاربر جدید
        const user = new SignModel({
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
            username: user.username,
            email: user.email,
            products: []
        };

        const httpToken = jwt.sign(
            { userId: user._id, email: user.email, products: [] },
            'httpToken'
        );
        cookieStore.set('httpToken', httpToken, { maxAge: 60 * 60 * 24 * 30, httpOnly: true });

        const token = jwt.sign(forToken, 'token');
        cookieStore.set('token', token, { maxAge: 60 * 60 * 24 * 30 });

        // حذف زمان ارسال مجدد کد و کد تأیید از کوکی
        cookieStore.delete('ResendTime');
        cookieStore.delete('email');

        // پاسخ موفقیت‌آمیز
        return res.json(
            { dt: token, message: 'ثبت نام با موفقیت انجام شد', token: 'true' },
            { status: 201 }
        );
    });
}