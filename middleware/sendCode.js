import nodemailer from 'nodemailer';
import cache from '@/utils/node_cache.js';
import { cookies } from 'next/headers';

function production_sendCode(to, path = '') {
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
                    resolve({ message: 'کد دریافتی را وارد کنید', data: 'code' });
                }
            }
        );
    });
}

//////////////////

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Description placeholder
 *
 * @export
 * @param {string} [to='']
 * @param {string} [path='']
 */
export default function sendCode(to = '', path = '') {
    return new Promise(async (resolve, reject) => {
        if (isProduction) {
            await production_sendCode(to, path);
        } else {
            const cookieStore = await cookies();
            cookieStore.set('code' + to, 12345, { maxAge: 180 });
            resolve({ message: '12345 را به عنوان کد وارد کنید', data: 'code' });
        }
    });
}

/**
 * Description placeholder
 *
 * @param {string} to
 * @param {number} code
 */
export const checkCode = (to, code) => {
    return new Promise(async (resolve, reject) => {
        if (isProduction) {
            if (cache.get('code' + to) != code) reject({ message: 'کد وارد شده اشتباه هست', status: 400 })
            else resolve();
            
        } else {
            const cookieStore = await cookies();
            if (cookieStore.get('code' + to)?.value != code) reject({ message: 'کد وارد شده اشتباه هست', status: 400 });
            else resolve();
            
        }
    });
};
