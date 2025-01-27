// وارد کردن middleware برای احراز هویت ادمین
import authAdminRoutes from '@/middleware/authAdminRoutes';
// وارد کردن مدل محصولات
import { ProductsModel } from '@/models/ProductModel';
// وارد کردن تابع اتصال به دیتابیس
import dbConnect from '@/utils/dbConnect';

// تعریف تابع PUT برای بروزرسانی وضعیت دیده شدن سوال
export async function PUT(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);

        // دریافت شناسه سوال از پارامترهای جستجو
        const id = req.nextUrl.searchParams.get('questionID');
        // بروزرسانی وضعیت دیده شدن سوال در دیتابیس
        await ProductsModel.updateOne({ 'questions._id': id }, { $set: { 'questions.$.seen': true } });

        // بازگشت پاسخ موفقیت آمیز
        return Response.json('', { status: 202 });
    } catch (error) {
        // بازگشت پاسخ خطا در صورت بروز مشکل
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
