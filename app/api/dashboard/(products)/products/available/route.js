// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

// تعریف تابع POST برای مدیریت درخواست‌های POST
/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

export async function POST(req) {
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از شناسه محصول و انتخاب فیلد 'available'
        const product = await ProductsModel.findById(req.nextUrl.searchParams.get('productID')).select('available');
        // اگر محصول پیدا نشد، ارسال پاسخ با وضعیت 400
        if (!product) return res.json('این گزینه قبلا از سرور حذف شده', { status: 400 });
        // تغییر وضعیت 'available' محصول
        product.available = !product.available;
        // ذخیره تغییرات محصول
        await product.save();
        // ارسال پاسخ با وضعیت 202 و داده‌های جدید
        return res.json({ dt: product.available }, { status: 202 });
    } catch (error) {
        // در صورت بروز خطا، ارسال پاسخ با پیام خطا و وضعیت مناسب
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
