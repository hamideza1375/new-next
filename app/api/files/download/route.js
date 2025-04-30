import dbConnect from '@/utils/dbConnect';
import { createReadStream } from 'fs';
import { decode } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { join } from 'path';

/**
 * دریافت فایل
 * 
 * این قسمت فایل های product را دریافت می کند
 * 
 * @param {Request} req - درخواست
 * @returns {Response} - پاسخ
 */
export async function GET(req) {
    try {
        await dbConnect();
        const httpUser = decode(req.cookies.get('httpToken')?.value, 'httpToken');
        const fileName = req.nextUrl.searchParams.get('filename');
        let id = fileName.split('_')[fileName.split('_').length - 2]
        let chapter = fileName.split('_')[fileName.split('_').length - 3]
        let license = httpUser?.products?.find(p => p.productId === id)

        // بررسی صلاحیت دسترسی
        if(id !== '667610dcca08b7215a5ba872')
            if (!license && chapter !== '1'){
                const htmlPage = generateHtmlPage('شما اجازه ی دسترسی ندارید');
                const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
                return new NextResponse(htmlPage, { status: 403, headers });
            }

        // دریافت مسیر فایل
        const filePath = join(process.cwd(), '/assets/uploads/product/' + fileName);
        const fileType = fileName.split('.').pop();
        const readStream = createReadStream(filePath);

        // تنظیم هدر ها
        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
        headers.set('Cache-Control', 'private, max-age=31536000');

        // تعیین نوع فایل
        if (fileType === 'zip') {
            headers.set('Content-Type', 'application/zip');
        } else if (fileType === 'rar') {
            headers.set('Content-Type', 'application/vnd.rar');
        } else {
            headers.set('Content-Type', 'video/mp4');
        }

        // ارسال پاسخ
        return new Response(readStream, {
            status: 200,
            headers: headers
        });
    } catch (error) {
        const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
        // const _headers = headers()
        // _headers.set('Content-Type', 'text/html; charset=utf-8')
        const body =
            typeof error?.message === 'string' &&
            `<p style="width:100%; text-align:center; margin-top:10px">${error?.message}</p>`;
        return new Response(body, { status: (error && error.status) || 500, headers });
    }
}



/**
 * تولید صفحه ی اچ تی ام ال
 * 
 * این قسمت صفحه ی اچ تی ام ال تولید می کند
 * 
 * @param {string} html - کد اچ تی ام ال
 * @returns {string} - کد اچ تی ام ال
 */
function generateHtmlPage(html) {
    return `<!DOCTYPE html>
	  <html>
		 <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
		 </head>
		 <body>
			<h1 style="color:red;text-align:center" >${html}</h1>
		 </body>
	  </html>`;
}

