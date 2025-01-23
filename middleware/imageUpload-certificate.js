import sharp from 'sharp';

// تابعی برای بهینه سازی تصویر گواهی
export default function optimizeImageCertificate(image) {
    // بررسی می کند که آیا تصویر دارای اندازه است یا خیر
    if (image?.size) {
        return new Promise(async (resolve, reject) => {
            // مسیر دایرکتوری فایل
            let fileDir = process.cwd() + '/assets/uploads/certificate/';
            try {
                // تبدیل تصویر به بافر
                let buffer = Buffer.from(await image.arrayBuffer());
                // تولید نام فایل منحصر به فرد
                let filename = Date.now().toString('32') + '' + Math.floor(Math.random() * 999999 + 100000) + '.webp';
                // ذخیره تصویر بهینه شده
                await sharp(buffer).toFile(fileDir + filename);
                resolve(filename);
            } catch {
                // در صورت بروز خطا
                reject({ message: 'تصویر آپلود نشد', status: 400 });
            }
        });
    } else return null; // اگر تصویر اندازه نداشته باشد، مقدار null برمی‌گرداند
}
