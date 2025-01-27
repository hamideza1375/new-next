import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse as res } from 'next/server';

import errorHandling from '@/middleware/errorHandling';

export async function POST(req) {
    errorHandling(async () => {
        
  // دریافت داده‌های ارسالی از کلاینت
  const body = await req.json();
  const { code } = body;

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

  // ایجاد توکن برای مدیر
  const forToken = {
    isAdmin: true,
    username: email,
    email: email,
    products: []
  };

  // ایجاد توکن httpToken برای مدیر
  const forHttpToken = {
    isAdmin: true,
    userId: email,
    username: email,
    email: email,
    products: []
  };

  const token = jwt.sign(forToken, 'token');
  cookieStore.set('token', token, { maxAge: 60 * 60 * 24 * 30 });


  // ذخیره توکن httpToken در کوکی
  const httpToken = jwt.sign(forHttpToken, 'httpToken');
  cookieStore.set('httpToken', httpToken, { maxAge: 60 * 60 * 24 * 30, httpOnly: true });

  // پاسخ موفقیت‌آمیز با توکن
  return res.json({ dt: httpToken, message: {}, token: 'true' }, { status: 200 });
})

}