// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

// تعریف تابع PUT برای به‌روزرسانی زمان‌های محصول
/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

export async function PUT(req) {
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // دریافت داده‌های زمان از درخواست
        const {times} = await req.json()

        // پیدا کردن محصول با استفاده از شناسه محصول
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID'));
        // به‌روزرسانی زمان‌های محصول
        product.times = times
        // ذخیره تغییرات در پایگاه داده
        await product.save();
        // بازگشت پاسخ موفقیت‌آمیز
        return Response.json({ message: 'تغییرات ذخیره شد', dt:product }, { status: 200 });
    } catch (error) {
        // ثبت خطا در کنسول
        console.log(error);
        // بازگشت پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تعریف تابع GET برای دریافت زمان‌های محصول
export async function GET(req) {
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از شناسه محصول و انتخاب فیلد زمان‌ها
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID')).select('times');
        // بازگشت زمان‌های محصول
        return Response.json(product.times)
    } catch (error) {
        // بازگشت پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}