// وارد کردن ماژول‌های مورد نیاز
import { createReadStream } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function GET(req) {
    // دریافت نام فایل از پارامترهای URL
    const fileName = req.nextUrl.searchParams.get('url');
    // ساخت مسیر کامل فایل با استفاده از نام فایل
    const filePath = join(process.cwd(), 'assets/uploads/question/' + fileName);
    // ایجاد جریان خواندن فایل
    const stream = createReadStream(filePath);
    // بازگشت پاسخ با جریان فایل و وضعیت 200
    return new NextResponse(stream, { status: 200 });
}
