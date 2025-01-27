// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse, NextResponse as res } from 'next/server';

// تعریف تابع GET برای پردازش درخواست‌های GET
/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

export async function GET(req) {
    // استخراج پارامترهای جستجو از URL درخواست
    const { nextUrl: { searchParams } } = req
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // یافتن محصول بر اساس ID محصول
        const product = await ProductsModel.findById(searchParams.get('productID'));
        // بازگرداندن قطعات محصول به صورت JSON
        return NextResponse.json(product?.parts || []);
    } catch (error) {
        // مدیریت خطا و بازگرداندن پیام خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
