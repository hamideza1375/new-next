// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

// تابع برای پردازش درخواست PUT
export async function PUT(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // دریافت داده‌های درخواست
        const {progress} = await req.json()
        // پیدا کردن محصول با استفاده از ID
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID'));
        // به‌روزرسانی پیشرفت محصول
        product.progress = progress
        // ذخیره تغییرات
        await product.save();
        // ارسال پاسخ موفقیت‌آمیز
        return Response.json({ message: 'تغییرات ذخیره شد', dt:product }, { status: 200 });
    } catch (error) {
        // ارسال پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع برای پردازش درخواست GET
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از ID و انتخاب فیلد پیشرفت
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID')).select('progress');
        // ارسال پاسخ موفقیت‌آمیز با داده‌های پیشرفت محصول
        return Response.json(product.progress)
    } catch (error) {
        // ارسال پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}