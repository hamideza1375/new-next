// وارد کردن ماژول‌های لازم
import { createReadStream } from 'fs';
import { join } from 'path';

// تابع GET برای پاسخ به درخواست‌ها
export async function GET(req) {
    // دریافت نام فایل از پارامترهای جستجو
    const fileName = req.nextUrl.searchParams.get('filename');
    // ساخت مسیر فایل با استفاده از نام فایل
    const filePath = join(process.cwd(), 'assets/uploads/product/' + fileName)

    // ایجاد جریان خواندن فایل
    const stream = createReadStream(filePath);

    // تنظیم هدرهای پاسخ
    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');

    // ایجاد جریان خواندن قابل خواندن
    const readableStream = new ReadableStream({
        start(controller) {
            // افزودن داده‌ها به جریان
            stream.on('data', chunk => {
                controller.enqueue(new Uint8Array(chunk));
            });
            // بستن جریان در پایان
            stream.on('end', () => {
                controller.close();
            });
            // مدیریت خطاها
            stream.on('error', err => {
                controller.error(err);
            });
        }
    });

    // بازگشت پاسخ با جریان خواندن
    return new Response(readableStream, {
        status: 200,
        headers: headers
    });
};

////////////////////
// وارد کردن ماژول‌های لازم
// import { createReadStream } from 'fs';
// import { join } from 'path';
// import { createHlsStream } from 'hls-stream';

// تابع GET برای پاسخ به درخواست‌ها
// export async function GET(req) {
//   // دریافت نام فایل از پارامترهای جستجو
//   const fileName = req.nextUrl.searchParams.get('filename');
//   // ساخت مسیر فایل با استفاده از نام فایل
//   const filePath = join(process.cwd(), 'assets/uploads/product/' + fileName);

//   // ایجاد جریان خواندن فایل
//   const stream = createReadStream(filePath);
//   // ایجاد جریان HLS
//   const hlsStream = createHlsStream(stream, {
//     segmentDuration: 10, // 10 ثانیه برای هر بخش
//     onSegment: (segment, index) => {
//       // افزودن منطق DRM، به عنوان مثال با استفاده از روش مبتنی بر توکن
//       // segment.key = generateToken(segment, index);
//     },
//   });

//   // تنظیم هدرهای پاسخ
//   const headers = new Headers();
//   headers.set('Content-Type', 'application/vnd.mpegurl');

//   // بازگشت پاسخ با جریان HLS
//   return new Response(hlsStream, {
//     status: 200,
//     headers: headers,
//   });
// }

/////////////////

// وارد کردن ماژول‌های لازم
// import { createReadStream } from 'fs';
// import { join } from 'path';
// import { Hls, Decrypter } from 'hls.js'; // فرض بر این است که hls.js نصب شده است

// تابع GET برای پاسخ به درخواست‌ها
// async function GET(req, res) {
//   // دریافت نام فایل از پارامترهای جستجو
//   const fileName = req.query.filename; // فرض بر این است که نام فایل یک پارامتر جستجو است
//   // ساخت مسیر فایل با استفاده از نام فایل
//   const filePath = join(process.cwd(), 'assets/uploads/product/', fileName);

//   // اعتبارسنجی دسترسی کاربر و تولید توکن DRM در صورت لزوم (جایگزین با منطق DRM خودتان)
//   const token = (fileName, req.headers); // پیاده‌سازی منطق تولید توکن

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     // ایجاد جریان خواندن فایل
//     const stream = createReadStream(filePath);
//     // ایجاد نمونه HLS
//     const hls = new Hls();

//     // ایجاد نمونه Decrypter با استفاده از توکن
//     const decrypter = new Decrypter({ key: () => token }); // استفاده از توکن برای رمزگشایی
//     hls.attachMedia(document.createElement('video')); // فرض بر این است که یک عنصر ویدیو وجود دارد
//     hls.on(Hls.Events.MEDIA_ATTACHED, () => {
//       hls.loadSource(filePath);
//       hls.trigger(Hls.Events.PLAY);
//     });

//     // مدیریت بارگذاری بخش‌ها
//     hls.on(Hls.Events.FRAGMENT_LOADING, (event, data) => {
//       const segmentUrl = data.url;

//       // افزودن توکن به URL بخش در صورت لزوم
//       const urlWithToken = addTokenToUrl(segmentUrl, token); // پیاده‌سازی منطق افزودن توکن

//       fetch(urlWithToken)
//         .then(response => response.arrayBuffer())
//         .then(arrayBuffer => {
//           const decryptedArrayBuffer = decrypter.decrypt(arrayBuffer, 0, arrayBuffer.byteLength); // رمزگشایی با استفاده از توکن
//           event.callback.onSuccess(decryptedArrayBuffer);
//         })
//         .catch(error => {
//           event.callback.onError(error);
//         });
//     });

//     // تنظیم هدرهای پاسخ
//     res.setHeader('Content-Type', 'application/vnd.mpegurl');
//     // ارسال جریان HLS به پاسخ
//     stream.pipe(hls);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

// export default GET;
