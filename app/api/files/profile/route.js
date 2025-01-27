import { createReadStream } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

// درخواست GET را پردازش می‌کند
export async function GET(req) {
    // دریافت نام فایل از پارامترهای جستجوی URL
    const fileName = req.nextUrl.searchParams.get('url');
    
    // ایجاد مسیر کامل فایل با استفاده از نام فایل
    const filePath = join(process.cwd(), 'assets/uploads/profile/' + fileName);
    
    // ایجاد یک جریان برای خواندن فایل
    const stream = createReadStream(filePath);
    
    // ارسال پاسخ با استفاده از جریان فایل
    return new NextResponse(stream, { status: 200 });
}

