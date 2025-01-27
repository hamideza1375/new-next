// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

// تعریف تابع PUT برای به‌روزرسانی اطلاعات محصول
/** @param {NextRequest} req * @param {() => void} @param {res} req * @param {() => void} */
export async function PUT(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از شناسه محصول
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID'));
        // اگر محصول پیدا نشد، ارسال پیام خطا
        if (!product) return res.send('این گزینه قبلا از سرور حذف شده', { status: 400 });
        // دریافت اطلاعات تخفیف از درخواست
        const { exp, value } = await req.json();
        // بررسی صحت مقادیر تخفیف
        if ((exp > 0 && value < 1) || (exp < 1 && value > 0))
            return Response('نمیشود فقط یک کدام از مقادیر زمان یا درصد تخفیف را مشخص کنید',{status:400});
        // تنظیم مقادیر تخفیف برای محصول
        product.offer =
            //   offerTime == 0 || offerValue == 0
            //       ? { exp: 0, value: 0 }
            //       :
            { exp: new Date().getTime() + 60000 * 60 * exp, value };
        // ذخیره محصول به‌روزرسانی شده
        await product.save();
        // ارسال پاسخ موفقیت‌آمیز
        return res.json({ message: {}, dt: product }, { status: 202 });
    } catch (error) {
        // ثبت خطا در کنسول و ارسال پیام خطا
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تعریف تابع GET برای دریافت اطلاعات تخفیف محصول
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از شناسه محصول و انتخاب فیلد تخفیف
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID')).select('offer');

        // محاسبه زمان باقی‌مانده تخفیف
        let { days, hours, minutes, seconds } = time(product.offer.exp);

        // ارسال پاسخ با اطلاعات تخفیف
        return Response.json(
            product.offer.exp > 0
                ? {
                      //   exp: ((product.offer.exp - new Date().getTime()) / (1000 * 60 * 60)).toFixed(2),
                      exp: (days > 7 ? (days + '/') : '' ) + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0'),
                      value: product.offer.value
                  }
                : {}
        );
    } catch (error) {
        // ارسال پیام خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع محاسبه زمان باقی‌مانده تخفیف
function time(exp) {
    let countDownDate = new Date(exp).getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = days > 7
        ? Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        : Math.floor(distance / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
}

