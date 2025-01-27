// وارد کردن میان‌افزار authAdminRoutes
import authAdminRoutes from '@/middleware/authAdminRoutes';
// وارد کردن مدل محصولات
import { ProductsModel } from '@/models/ProductModel';
// وارد کردن تابع اتصال به دیتابیس
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت نظرات
export async function GET({ nextUrl: { searchParams }, cookies }) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // بررسی احراز هویت ادمین
        await authAdminRoutes({ cookies });

        // اجرای کوئری برای دریافت نظرات
        const comments = await ProductsModel.aggregate([
            // باز کردن آرایه نظرات
            { $unwind: '$comments' },
            // فیلتر کردن نظراتی که نمایش داده نمی‌شوند
            { $match: { 'comments.show': {$ne: true} } },
            {
                // اتصال به جدول کاربران
                $lookup: {
                    from: 'signs', // این باید نام جدول کاربران در دیتابیس MongoDB باشد
                    localField: 'comments.userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            // باز کردن آرایه کاربران
            { $unwind: '$user' },
            // جایگزینی ریشه با ترکیب اطلاعات کاربر و نظر
            { $replaceRoot: { newRoot: { $mergeObjects: [{ email: '$user.email', mainId: '$$ROOT._id' }, '$comments'] } } },
            // حذف فیلدهای غیر ضروری
            { $project: { userId: 0, answer: 0 } }
        ]).exec();

        // بازگشت نظرات به صورت JSON
        return Response.json(comments);
    } catch (error) {
        // ثبت خطا در کنسول
        console.log(error);
        // بازگشت پیام خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
