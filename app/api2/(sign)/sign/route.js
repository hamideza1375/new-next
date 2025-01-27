import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse as res } from 'next/server';

import errorHandling from '@/middleware/errorHandling';
import rateLimit from '@/middleware/rateLimit';
import sendCode from '@/middleware/sendCode';
import { UserModel } from '@/models/UserModel';
import cache from '@/utils/node_cache.js';
import { SignUpValidator } from '@/validator/SignValidator';



export async function POST(req) {
    /** @param {NextRequest} req * @param {() => void} */

    return errorHandling(async()=>{

    const cookieStore = cookies();

    // بررسی وجود توکن در کوکی‌ها
    if (cookieStore.get('token')) return Response.json('شما در حال حاضر یک حساب فعال دارید', { status: 429 });

    // دریافت اطلاعات از درخواست
    const body = await req.json();

    const { email, password, username, code, ResendCode } = body;

    // جستجوی کاربر با ایمیل
    const user = await UserModel.findOne({ email });

    const expiresIn = 60 * 60 * 24 * 30;
    if (user) {
        // محدودیت نرخ درخواست‌ها
        return rateLimit(async () => {
            await UserModel.validate(body);
            if (!user) return res.json({ message: 'مشخصات اشتباه هست' }, { status: 400 });

                await user.comparePassword(password);

            if (!user.isAdmin) {
                // ایجاد توکن برای کاربر عادی
                const forToken = {
                    ...user.sellerId && {sellerId:user.sellerId},
                    username: user.username,
                    email: user.email,
                    products: user.products
                };

                
                const httpToken = jwt.sign({username: user.username, userId:user._id, email: user.email, products:user.products, ...user.sellerId && {sellerId:user.sellerId}}, 'httpToken');
                cookieStore.set('httpToken', httpToken, { maxAge: expiresIn, httpOnly: true });

                const token = jwt.sign(forToken, 'token');
                cookieStore.set('token', token, { maxAge: expiresIn });

                return res.json({ dt: token, message: {}, token: 'true' }, { status: 200 });
            } else if (user.isAdmin && !cookieStore.get('okAdmin')) {
                // ارسال کد برای مدیر
                    if (cookieStore.get('ResendTime')) return Response.json('تا اتمام سه دقیقه صبر کنید', { status: 429 });

                    const response = await sendCode(email, 'sign')

                    const creationTime = Date.now();
                    const expiresTime = creationTime + 60 * 1000 * 3;
                    cookieStore.set('ResendTime', expiresTime, { maxAge: 180 });
                    cookieStore.set('okAdmin', 'true', { maxAge: 180, httpOnly: true });

                    return Response.json(response);
                
            } else if (user.isAdmin && cookieStore.get('okAdmin')) {
                // بررسی کد وارد شده توسط مدیر
                if (cache.get('code' + email) != code) return Response.json('کد وارد شده اشتباه هست', { status: 400 });
                const forToken = {
                    isAdmin: user.isAdmin,
                    username: user.username,
                    email: user.email,
                    products:user.products
                };

                const forUserIdToken = {
                    isAdmin: user.isAdmin,
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    products:user.products
                };

                const httpToken = jwt.sign(forUserIdToken, 'httpToken');
                cookieStore.set('httpToken', httpToken, { maxAge: expiresIn, httpOnly: true });

                const token = jwt.sign(forToken, 'token');
                cookieStore.set('token', token, { maxAge: expiresIn });
                cache.del('code' + email)
                return res.json({ dt: token, message: {}, token: 'true' }, { status: 200 });
            }
        });
    } else {
        // کاربر جدید
        if (!username) {
            if (cookieStore.get('ResendTime'))
                return Response.json('تا اتمام سه دقیقه صبر کنید', { status: 429 });
            return Response.json({ message: 'برای خود یک نام کاربری انتخاب کنید', dt: 'username' });
        } else if (!code || ResendCode){
            // ارسال کد برای کاربر جدید
                if (cookieStore.get('ResendTime')) return Response.json('تا اتمام سه دقیقه صبر کنید', { status: 429 });

                const response = await userSendCode();

                const creationTime = Date.now();
                const expiresTime = creationTime + 60 * 1000 * 3;
                cookieStore.set('ResendTime', expiresTime, { maxAge: 180 });

                return Response.json(response, {status:206});
        } else {
            // بررسی کد وارد شده توسط کاربر جدید
            if (cookieStore.get('code')?.value != code) return Response.json('کد وارد شده اشتباه هست', { status: 400 });

            SignUpValidator.validateSync(body);
            await UserModel.validate(body);
            const userLength = await UserModel.countDocuments();
            const user = new UserModel({
                username: username,
                password: password,
                email: email
            });
            if (userLength === 0) {
                user.isAdmin = 1;
                await user.save();
            } else await user.save();

            const forToken = {
                username: user.username,
                email: user.email,
                products: []
            };

            const httpToken = jwt.sign({userId:user._id, email: user.email, products:[]}, 'httpToken');
            cookieStore.set('httpToken', httpToken, { maxAge: expiresIn, httpOnly: true });

            const token = jwt.sign(forToken, 'token');
            cookieStore.set('token', token, { maxAge: expiresIn });

            cookieStore.delete('ResendTime');
            return res.json({ dt: token, message: 'ثبت نام با موفقیت انجام شد', token: 'true' }, { status: 201 });
        }
    }
})

}


// تابع ارسال کد برای کاربر جدید
function userSendCode(){
    return new Promise((resolve, reject) => {
    const random = Math.floor(Math.random() * (90000) + 1000);
    const cookieStore = cookies();
    if(!cookieStore.get('code')) cookieStore.set('code', random, { maxAge: 180, httpOnly: true })
    else return reject({message:'بعد از اتمام سه دقیقه دوباره امتحان کنید', status:429});
    resolve({ message: 'کد دریافتی را وارد کنید', dt: 'code', code: random });
    })
}