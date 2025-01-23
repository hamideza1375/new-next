import nodemailer from 'nodemailer';
import cache from '../utils/node_cache.js';

export default function sendCode(to, path = '') {
    return new Promise((resolve, reject) => {
        // تولید یک کد تصادفی
        const random = Math.floor(Math.random() * 90000 + 1000);
        // بررسی اینکه آیا کد قبلاً برای این کاربر ارسال شده است یا خیر
        if (!cache.get('code' + to)) cache.set('code' + to, random);
        else
            return reject({
                message: 'بعد از اتمام سه دقیقه دوباره امتحان کنید, در صورت بروز مشکل صفحه را دوباره لود کنید',
                status: 429
            });

        // بررسی محدودیت نرخ ارسال کد
        if (cache.get('rateLimit' + path + to) >= 5)
            return reject({
                message: 'شما بیش از حد مجاز تلاش کردید, لطفا تا اتمام زمان ۵ دقیقه ای منتظر بمانید',
                status: 429
            });

        // تنظیم محدودیت نرخ ارسال کد
        cache.set('rateLimit' + path + to, (cache.get('rateLimit' + path + to) || 0) + 1, 60 * 5);

        // تنظیمات سرویس ایمیل
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'reza.attar1375@outlook.com',
                pass: process.env.SECRET_PASSWORD
            }
        });
        // ارسال ایمیل
        transporter.sendMail(
            {
                from: 'reza.attar1375@outlook.com',
                to,
                subject: 'ارسال کد از jslearn',
                text: `
jslearn.ir ارسال از
 Code: ${random}`
            },
            (err, info) => {
                if (err || !info) {
                    // در صورت بروز خطا، کد از حافظه کش حذف می‌شود
                    cache.del('code' + to);
                    reject('مشکلی پیش آمد اتصال اینترنت را برسی کنید');
                } else {
                    resolve({ message: 'کد دریافتی را وارد کنید', dt: 'code' });
                }
            }
        );
    });
}
