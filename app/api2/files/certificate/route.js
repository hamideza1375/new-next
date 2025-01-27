import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET(req) {
    // دریافت نام فایل از پارامترهای جستجوی URL
    const fileName = req.nextUrl.searchParams.get('c');
    // ایجاد مسیر کامل فایل با استفاده از نام فایل
    const filePath = join(process.cwd(), 'assets/uploads/certificate/' + fileName);

    try {
        // خواندن محتوای فایل به صورت غیرهمزمان
        const file = await fs.readFile(filePath);

        // ارسال پاسخ با محتوای فایل و هدرهای مناسب
        return new Response(file, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf', // تعیین نوع محتوا به عنوان PDF
                'Content-Disposition': 'inline' // تعیین نحوه نمایش فایل به صورت inline
            }
        });
    } catch (error) {
        // در صورت عدم وجود فایل، ارسال پاسخ با وضعیت 404
        return new Response('File not found', { status: 404 });
    }
}

// const fileExtension = fileName.split('.').pop();

// let contentType;
// if (fileExtension === 'pdf') {
//     contentType = 'application/pdf';
// } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
//     contentType = `image/${fileExtension}`;
// } else {
//     return new Response('Unsupported file type', { status: 400 });
// }
