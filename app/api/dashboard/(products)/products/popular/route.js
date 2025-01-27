// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

// تعریف تابع PUT برای به‌روزرسانی وضعیت محبوبیت محصول
/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

export async function PUT(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از شناسه محصول
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID'));
        // تغییر وضعیت محبوبیت محصول
        product.popular = !product.popular
        // ذخیره تغییرات در دیتابیس
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

// تعریف تابع GET برای دریافت وضعیت محبوبیت محصول
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از شناسه محصول و انتخاب فیلد محبوبیت
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID')).select('popular');
        // بازگشت وضعیت محبوبیت محصول
        return Response.json(product.popular)
    } catch (error) {
        // بازگشت پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}