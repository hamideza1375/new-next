import { createReadStream } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

/**
 * دریافت فایل محصول
 *
 * این تابع فایل های محصول را دریافت می کند
 *
 * @param {Request} req - درخواست
 * @returns {Response} - پاسخ
 */
export async function GET(req) {
    // دریافت نام فایل از پارامترهای جستجوی URL
    const fileName = req.nextUrl.searchParams.get('url');

    // ایجاد مسیر کامل فایل با استفاده از نام فایل
    const filePath = join(process.cwd(), 'assets/uploads/product/' + fileName);

    // تنظیم هدرهای پاسخ
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=31536000');

    // خواندن محتوای فایل به صورت غیرهمزمان
    const stream = createReadStream(filePath);

    // ارسال پاسخ با محتوای فایل و هدرهای مناسب
    return new NextResponse(stream, { status: 200, headers });
}


