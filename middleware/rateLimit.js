import { cookies } from 'next/headers';

export default async function rateLimit(call) {
    return errorHandling(async()=>{
        // دریافت کوکی‌ها
        const cookieStore = cookies();
        // دریافت تعداد تلاش‌ها و مقدار retry از کوکی‌ها
        let attempts = Number(cookieStore.get('attempts')?.value) || 0;
        let retry = Number(cookieStore.get('retry')?.value) || 0;

        // بررسی تعداد تلاش‌ها
        if (attempts >= 5) {
            // تنظیم کوکی retry برای ۱ ساعت
            cookieStore.set('retry', 1, { maxAge: 60 * 60, httpOnly: true });
            return Response.json(
                {
                    message: `شما بیش از حد مجاز تلاش کرده‌اید. لطفاً تا اتمام زمان ۵ دقیقه ای منتظر بمانید `
                },
                { status: 429 }
            );
        } else if (retry == 3) {
            return Response.json(
                {
                    message: `شما بیش از حد مجاز تلاش کرده‌اید. لطفاً تا اتمام زمان ۱ ساعته منتظر بمانید `
                },
                { status: 429 }
            );
        }

        // افزایش مقدار retry در صورت وجود
        if(retry) cookieStore.set('retry', retry + 1, { maxAge: 60 * 60, httpOnly: true });

        // افزایش تعداد تلاش‌ها
        cookieStore.set('attempts', attempts + 1, { maxAge: 5 * 60, httpOnly: true });
        return await call();
    })
}
