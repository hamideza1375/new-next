import { cookies } from 'next/headers';
import { NextRequest, NextResponse as res } from 'next/server';
import { UsersModel } from '@/models/UsersModel';
import sendCode from '@/middleware/sendCode';
import errorHandling from '@/middleware/errorHandling';
import { CustomError } from '@/utils/CustomError';

/** @param {NextRequest} req * @param {() => void} */

export async function POST(req) {
    console.log(1234555);
    
    return errorHandling(async () => {

       throw new CustomError({message: 'send-code-filed', status: 400})

        // const cookieStore = cookies();
        const cookieStore = await cookies()

        // اگر کاربر قبلاً وارد شده باشد، اجازه ارسال کد نده
        if (cookieStore.get('token') || cookieStore.get('httpToken')) {
            return res.json('شما در حال حاضر یک حساب فعال دارید', { status: 429 });
        }

        // دریافت ایمیل از بدنه درخواست
        const { email } = await req.json();

        // دریافت می‌شود) _id بررسی وجود کاربر با ایمیل ارسالی (با پروجکشن فقط فیلد
        const user = await UsersModel.findOne({ email }).select('_id').lean();

        // اگر کاربر با این ایمیل وجود داشته باشد
        if (user) { return res.json('شما قبلاً ثبت‌نام کرده‌اید', { status: 400 });}

        // اگر زمان ارسال مجدد کد فعال باشد، خطا بازگردانده شود
        if (cookieStore.get('ResendTime')) {
            return res.json('تا اتمام سه دقیقه صبر کنید', { status: 429 });
        }


        // ارسال کد تأیید
            const response = await sendCode(email, req.url);

            // تنظیم زمان ارسال مجدد کد (۳ دقیقه)
            const creationTime = Date.now();
            const expiresTime = creationTime + 60 * 1000 * 3; // 3 دقیقه
            cookieStore.set('ResendTime', expiresTime, { maxAge: 180, expires: expiresTime });

            // ذخیره ایمیل در کوکی برای استفاده در مرحله بعد
            cookieStore.set('email', email, { maxAge: 180 });

            return res.json(response, { status: 200 });
    })
}