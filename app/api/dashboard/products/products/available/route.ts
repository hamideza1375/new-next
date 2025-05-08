import authAdminRoutes from '@/middleware/authAdminRoutes';
import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse as res } from 'next/server';

export async function POST(req: NextRequest) {
    errorHandling(async () => {
        // اتصال به پایگاه داده
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes();

        // پیدا کردن محصول با استفاده از شناسه محصول و انتخاب فیلد 'available'
        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return res.json('شناسه محصول مورد نیاز است', { status: 400 });
        }

        const product = await ProductsModel.findById(productId).select('available');
        // اگر محصول پیدا نشد، ارسال پاسخ با وضعیت 400
        if (!product) {
            return res.json('این گزینه قبلا از سرور حذف شده', { status: 400 });
        }

        // تغییر وضعیت 'available' محصول
        product.isActive = !product.isActive;
        // ذخیره تغییرات محصول
        await product.save();

        // ارسال پاسخ با وضعیت 202 و داده‌های جدید
        return res.json({ dt: product.isActive }, { status: 202 });
    });
}
