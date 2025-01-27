import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import errorHandling from '@/middleware/errorHandling';
import sendCode, { checkCode } from '@/middleware/sendCode';
import { SignModel } from '@/models/SignModel';
import cache from '@/utils/node_cache.js';

/**
 * در این تابع، کاربر می تواند از طریق ایمیل خود و گذرواژه جدید، مشخصات خود را تغییر دهد
 * @param {NextRequest} req 
 * @param {() => void} 
 */
export async function POST(req) {
    return errorHandling(async()=>{

    // اگر زمان ارسال مجدد کد به پایان رسیده باشد، اجازه ارسال مجدد را می دهیم
    const cookieStore = cookies();
    if (cookieStore.get('ResendTime')) return Response.json('تا اتمام سه دقیقه صبر کنید', { status: 429 });

    // اطلاعات کاربر
    const _user = JSON.parse(req.headers.get('user'));

    // دریافت اطلاعات جدید کاربر از ریکوئست
    const body = await req.json();

    // بررسی ایمیل کاربر
    const user = await SignModel.findOne({ email: _user.email });

    // بررسی گذرواژه قبلی کاربر
    const confirmPass = await bcrypt.compare(body.password, user.password);
    if (!confirmPass) return Response.json('رمز عبور قبلی را صحیح وارد کنید', { status: 400 });

    // ارسال کد
    const response = await sendCode(_user.email, req.url);

    // تعیین زمان ارسال مجدد کد
    const creationTime = Date.now();
    const expiresTime = creationTime + 60 * 1000 * 3;
    cookieStore.set('ResendTime', expiresTime, { maxAge: 180 });

    // ارسال پاسخ
    return Response.json(response);
    })
}

///////////

/**
 * در این تابع، کاربر می تواند با وارد کردن کد دریافتی و گذرواژه جدید، گذرواژه خود را تغییر دهد
 * @param {NextRequest} req 
 * @param {() => void} 
 */
export async function PUT(req) {
    return errorHandling(async()=>{
    // گرفتن کوکی ها
    const cookieStore = cookies();

    // دریافت اطلاعات کاربر
    const _user = JSON.parse(req.headers.get('user'));
    const {code, username, newPassword } = await req.json();

    // چک کردن کد
    if (cache.get('code' + _user.email) != code)
        return Response.json('کد وارد شده صحیح نمیباشد', { status: 400 });

    await checkCode(code, _user.email)

    // دریافت اطلاعات کاربر
    const user = await SignModel.findOne({ email: _user.email });

    // بروزرسانی اطلاعات کاربر
    user.username = username;
    user.password = newPassword;
    await user.save();

    // ساخت توکن
    const forToken = {
        ...user.sellerId && {sellerId:user.sellerId},
        username: user.username,
        email: user.email,
        products:user.products
    };
    const token = sign(forToken, 'token');

    // ذخیره سازی توکن
    cookieStore.set('token', token, { maxAge: 60 * 60 * 24 });

    // ساخت توکن کاربر
    const forUserIdToken = {username: user.username, userId: user._id, email: user.email, products:user.products, ...user.sellerId && {sellerId:user.sellerId} };
    const httpToken = sign(forUserIdToken, 'httpToken');

    // ذخیره سازی توکن کاربر
    cookieStore.set('httpToken', httpToken, { maxAge: 60 * 60 * 24, httpOnly: true });

    // حذف کوکی ارسال مجدد کد
    cookieStore.delete('ResendTime');

    // حذف کد از کد
    cache.del('code' + user.email)

    // ارسال پاسخ
    return Response.json({ value: token, message: {} }, { status: 201 });
    })
}

