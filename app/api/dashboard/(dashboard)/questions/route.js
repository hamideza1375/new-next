// وارد کردن میان‌افزار authAdminRoutes
import authAdminRoutes from '@/middleware/authAdminRoutes';
// وارد کردن مدل ProductsModel
import { ProductsModel } from '@/models/ProductModel';
// وارد کردن تابع dbConnect برای اتصال به پایگاه داده
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت سوالات
export async function GET({ nextUrl: { searchParams }, cookies }) {
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        // بررسی احراز هویت ادمین
        await authAdminRoutes({ cookies });

        // اجرای کوئری برای دریافت سوالات
        const questions = await ProductsModel.aggregate([
            // باز کردن آرایه questions
            { $unwind: '$questions' },
            // مرتب‌سازی سوالات بر اساس تاریخ به صورت نزولی
            { $sort: { 'questions.date': -1 } },
            // محدود کردن تعداد سوالات بر اساس پارامتر page
            { $limit: searchParams.get('page') ? 8 : 200 },
            // فیلتر کردن سوالات دیده نشده
            { $match: { 'questions.seen': false } },
            // جایگزینی ریشه سند با سوالات
            { $replaceRoot: { newRoot: '$questions' } },
            // حذف فیلدهای userId، answer و username از خروجی
            { $project: { userId: 0, answer: 0, username: 0 } }
        ]).exec();

        // بازگشت پاسخ به صورت JSON
        return Response.json(questions);
    } catch (error) {
        // چاپ خطا در کنسول
        console.log(error);
        // بازگشت پاسخ خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
