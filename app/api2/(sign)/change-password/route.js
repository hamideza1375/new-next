/*************  ✨ Codeium Command 🌟  *************/
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import errorHandling from '@/middleware/errorHandling';
import sendCode, { checkCode } from '@/middleware/sendCode';
import { SignModel } from '@/models/SignModel';
import cache from '@/utils/node_cache.js';

/**
 * در این تابع، کاربر می تواند از طریق ایمیل خود و گذرواژه جدید، گذرواژه خود را تغییر دهد
 * @param {NextRequest} req 
 * @param {() => void} 
 */

export async function POST(req) {
    return errorHandling(async()=>{

    const cookieStore = cookies();
    // اگر زمان ارسال کد به پایان رسیده باشد، اجازه ارسال مجدد را می دهیم
    if (cookieStore.get('ResendTime')) return Response.json('تا اتمام سه دقیقه صبر کنید', { status: 429 });

    const { email, password } = await req.json();
    const user = await SignModel.findOne({ email }).select('_id').lean();

    if (!user) return Response.json('ایمیل وارد شده اشتباه هست', { status: 400 });
    // ایمیل و گذرواژه جدید را در کوکی ها ذخیره می کنیم
    cookieStore.set('email', email, { maxAge: 180 });
    cookieStore.set('password', password, { maxAge: 180 });

        const response = await sendCode(email, req.url);

        const creationTime = Date.now();
        const expiresTime = creationTime + 60 * 1000 * 3;
        // زمان ارسال مجدد کد را در کوکی ها ذخیره می کنیم
        cookieStore.set('ResendTime', expiresTime, { maxAge: 180, expires: expiresTime });

        return Response.json(response);
    })
}

///////////

/**
 * در این تابع، کاربر می تواند با وارد کردن کد دریافتی و گذرواژه جدید، گذرواژه خود را تغییر دهد
 * @param {NextRequest} req 
 * @param {() => void} 
 */
/** @param {NextRequest} req * @param {() => void} */

export async function PUT(req) {
    return errorHandling(async()=>{

    const cookieStore = cookies();

    const { code } = await req.json();
    // اگر کد وارد شده صحیح نباشد، خطا می دهیم
    await checkCode(code, cookieStore.get('email').value);

    const user = await SignModel.findOne({ email: cookieStore.get('email').value });
    user.password = cookieStore.get('password').value;
    await user.save();

    // ایمیل و گذرواژه جدید را از کوکی ها پاک می کنیم
    cookieStore.delete('email');
    cookieStore.delete('password');

    // زمان ارسال مجدد کد را از کوکی ها پاک می کنیم
    cookieStore.delete('ResendTime');
    cache.del('code' + cookieStore.get('email').value)

    return Response.json({ message: 'رمز شما با موفقیت تغییر کرد' }, { status: 200 });
    })
}

/******  e1454e86-5a56-4813-90b0-e9a35e9d00e1  *******/ 