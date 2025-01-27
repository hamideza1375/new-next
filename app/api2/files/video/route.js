// وارد کردن ماژول‌های مورد نیاز
import dbConnect from '@/utils/dbConnect';
import { createReadStream, statSync } from 'fs';
import { decode } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { join } from 'path';

// تنظیمات دینامیک بودن
export const dynamic = 'force-dynamic'
// export const revalidate = 0

// تابع GET برای پاسخ به درخواست‌های GET
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // استخراج httpToken از کوکی‌ها
        const httpUser = decode(req.cookies.get('httpToken')?.value, 'httpToken');
        // استخراج نام فایل از پارامترهای URL
        const fileName = req.nextUrl.searchParams.get('filename');
        // استخراج id و chapter از نام فایل
        let id = fileName.split('_')[fileName.split('_').length - 2]
        let chapter = fileName.split('_')[fileName.split('_').length - 3]
        // بررسی مجوز دسترسی کاربر به فایل
        let license = httpUser?.products?.find(p => p.productId === id);

        // اگر کاربر مجوز دسترسی نداشته باشد و chapter برابر 1 نباشد
        if (id !== '667610dcca08b7215a5ba872')
            if (!license && chapter !== '1') {
                // ارسال ویدئوی عدم دسترسی
                const filePath = join(process.cwd(), 'public/Inaccessibility.mp4');
                const stream = createReadStream(filePath);
                const headers = new Headers();
                headers.set('Content-Type', 'video/mp4');
                return new NextResponse(stream, { status: 200, headers });
            }

        // تنظیمات مربوط به رنج درخواست
        const range = req.headers.get('range') || 'bytes=0-';
        const filePath = join(process.cwd(), 'assets/uploads/product/' + fileName);
        const videoSize = statSync(filePath)?.size;

        // تنظیمات مربوط به اندازه chunk
        const chunkSize = 1 * 1e6; // 1MB
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + chunkSize, videoSize - 1);

        const contentLength = end - start + 1;

        // تنظیم هدرهای پاسخ
        const headers = new Headers();
        headers.set('Content-Range', `bytes ${start}-${end}/${videoSize}`);
        headers.set('Accept-Ranges', 'bytes');
        headers.set('Content-Length', contentLength);
        headers.set('Content-Type', 'video/mp4');
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // کش را غیرفعال می‌کند

        // ایجاد استریم برای ارسال ویدئو
        const stream = createReadStream(filePath, { start, end });

        // بازگشت پاسخ با استریم ویدئو
        return new NextResponse(stream, {
            status: 206,
            headers: headers
        });
    } catch (error) {
        // لاگ کردن خطا و بازگشت پاسخ خطا
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// کدهای کامنت شده اضافی
// import { EventEmitter } from 'node:events';
// const myEmitter = new EventEmitter();

// First listener

/////////////

// import authUserRoutes from '@/middleware/authUserRoutes';
// import dbConnect from '@/utils/dbConnect';
// import { createReadStream, statSync } from 'fs';
// import { NextResponse } from 'next/server';
// import { join } from 'path';

// export async function GET(req) {
//     try {
//         await dbConnect();
//         await authUserRoutes(req);
//         const { url } = req;
//         const range = req.headers.get('range') || 'bytes=0-';
//         const fileName = url.split('/').pop();
//         const filePath = join(process.cwd(), 'assets/uploads/product/' + fileName);
//         const videoSize = statSync(filePath)?.size;

//         const chunkSize = 1 * 1e6; // 1MB
//         const start = Number(range.replace(/\D/g, ''));
//         const end = Math.min(start + chunkSize, videoSize - 1);

//         const contentLength = end - start + 1;

//         const headers = new Headers();
//         headers.set('Content-Range', `bytes ${start}-${end}/${videoSize}`);
//         headers.set('Accept-Ranges', 'bytes');
//         headers.set('Content-Length', contentLength);
//         headers.set('Content-Type', 'video/mp4');
//         headers.set('Cache-Control', 'public, max-age=86400');

//         const stream = createReadStream(filePath, { start, end });

//         const readableStream = new ReadableStream({
//             start(controller) {
//                 stream.on('data', chunk => {
//                     //  controller.enqueue(new Uint8Array(chunk));
//                      controller.enqueue(chunk);
//                 });
//                 stream.on('end', () => {
//                     controller.close();
//                 });
//                 stream.on('error', err => {
//                     controller.error(err);
//                 });
//             }
//         });

//         return new NextResponse(readableStream, {
//             status: 206,
//             headers: headers
//         });
//     } catch (error) {
//         return Response.json(error?.message, { status: (error && error.status) || 500 });
//     }
// }
