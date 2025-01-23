import { headers } from 'next/headers';
import sharp from 'sharp';

export default function optimizeImage(image) {
    if (image?.size) {
        return new Promise(async (resolve, reject) => {
            const _headers = headers();

            let fileDir;
            // بررسی مسیر ارجاع دهنده برای تعیین دایرکتوری فایل
            if (_headers.get('referer').includes('tickets')) fileDir = process.cwd() + '/assets/uploads/ticket/';
            else if (_headers.get('referer').includes('questions'))
                fileDir = process.cwd() + '/assets/uploads/question/';

            try {
                let buffer = Buffer.from(await image.arrayBuffer());
                // تولید نام فایل به صورت تصادفی
                let filename =
                    Date.now().toString('32') + '' + Math.floor(Math.random() * 999999 + 100000) + '.webp';
                const sharpImage = sharp(buffer);

                const { width, height, format, size } = await sharpImage.metadata();

                // بررسی اندازه تصویر و انجام عملیات بهینه‌سازی
                if (size <= 500) {
                    await sharp(buffer).toFile(fileDir + filename);
                } else if (size <= 1000000) {
                    await sharp(buffer)
                        .resize({
                            width: Math.floor(width / 2),
                            height: Math.floor(height / 2),
                            fit: 'cover'
                        })
                        .webp({ quality: 90 })
                        .toFile(fileDir + filename);
                } else if (size <= 1500000) {
                    await sharp(buffer)
                        .resize({
                            width: Math.floor(width / 3),
                            height: Math.floor(height / 3),
                            fit: 'cover'
                        })
                        .webp({ quality: 80 })
                        .toFile(fileDir + filename);
                } else if (size > 1500000) {
                    await sharp(buffer)
                        .resize({
                            width: Math.floor(width / 4),
                            height: Math.floor(height / 4),
                            fit: 'cover'
                        })
                        .webp({ quality: 70 })
                        .toFile(fileDir + filename);
                }

                /* const {format, width, height, premultiplied, size } = */
                resolve(filename);
            } catch {
                // در صورت بروز خطا در آپلود تصویر
                reject({ message: 'تصویر آپلود نشد', status: 400 });
            }
        });
    } else return null;
}
// 500 Internal Server Error: این کد نشان‌دهنده مشکلی در سرور است که باعث ناموفقیت در ذخیره‌سازی تصویر می‌شود
// 413 Request Entity Too Large: اگر تصویر بسیار بزرگ باشد، این کد نشان‌دهنده این است که سرور قادر به پردازش درخواست نیست.
