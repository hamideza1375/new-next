import authAdminRoutes from '@/middleware/authAdminRoutes';
import { IProduct, ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
    // استخراج پارامترهای جستجو از URL
    const productID = req.nextUrl.searchParams.get('productID');
    
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        
        // احراز هویت ادمین
        await authAdminRoutes();

        // اعتبارسنجی پارامتر productID
        if (!productID || !mongoose.Types.ObjectId.isValid(productID)) {
            return NextResponse.json(
                { error: 'شناسه محصول نامعتبر است' },
                { status: 400 }
            );
        }

        // یافتن محصول بر اساس ID
        const product = await ProductsModel.findById(productID)
            .select('parts') // فقط فیلد parts را انتخاب می‌کنیم
            .lean(); // برای دریافت شیء ساده جاوااسکریپت

        // اگر محصول پیدا نشد
        if (!product) {
            return NextResponse.json(
                { error: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        // بازگرداندن قطعات محصول یا آرایه خالی اگر parts وجود نداشت
        return NextResponse.json(product.parts || []);
        
    } catch (error: any) {
        console.error('خطا در دریافت قطعات محصول:', error);
        
        // مدیریت خطاها
        const statusCode = error?.status || 500;
        const errorMessage = error?.message || 'خطای سرور در دریافت قطعات محصول';
        
        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}