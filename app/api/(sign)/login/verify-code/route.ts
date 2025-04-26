import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse as res, type NextRequest } from 'next/server';

import errorHandling from '@/middleware/errorHandling';
import cache from '@/utils/node_cache.js';

// Define interfaces for better type safety
interface RequestBody {
  code: string;
}

interface TokenPayload {
  isAdmin: boolean;
  userId: string;
  username: string;
  email: string;
  products: any[];
}



export async function POST(req: NextRequest) {
  return errorHandling(async () => {
    const cookieStore = await cookies();

    // دریافت داده‌های ارسالی از کلاینت
    const body: RequestBody = await req.json();
    const { code } = body;

    // دریافت ایمیل از کوکی
    const email = cookieStore.get('email')?.value;

    // اگر ایمیل وجود نداشته باشد، خطا بازگردانده شود
    if (!email) {
      return res.json(
        { message: 'لطفاً ابتدا کد تأیید را دریافت کنید' }, 
        { status: 400 }
      );
    }

    // بررسی صحت کد تأیید
    const cachedCode = cache.get('code' + email);
    if (cachedCode !== code) {
      return res.json(
        { message: 'کد وارد شده اشتباه هست' }, 
        { status: 400 }
      );
    }

    // ایجاد توکن برای مدیر
    const forToken: TokenPayload = {
      isAdmin: true,
      userId: email,
      username: email,
      email: email,
      products: []
    };

    const token = jwt.sign(forToken, 'token');
    const httpToken = jwt.sign(forToken, 'httpToken');

    // Create response
    const response = res.json(
      { dt: token, message: {}, token: 'true' },
      { status: 200 }
    );

    // Set cookies on the response
    response.cookies.set('token', token, { 
      maxAge: 60 * 60 * 24 * 30 
    });
    response.cookies.set('httpToken', httpToken, { 
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true 
    });

    return response;
  });
}