// وارد کردن میان‌افزار authAdminRoutes
import authAdminRoutes from '@/middleware/authAdminRoutes';
// وارد کردن مدل PaymentsModel
import { PaymentsModel } from '@/models/PaymentsModel';
// وارد کردن تابع dbConnect برای اتصال به دیتابیس
import dbConnect from '@/utils/dbConnect';

// تنظیم حالت داینامیک برای روت
export const dynamic = 'force-dynamic'

// تابع GET برای دریافت اطلاعات
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // دریافت userId از پارامترهای جستجو
        const userId = req.nextUrl.searchParams.get('userId')

        // جستجوی پرداخت‌های موفق مربوط به نماینده خاص در ۳۵ روز گذشته
        const payments = await PaymentsModel.find({
            success: true,
            representative: userId,
            date: { $gte: new Date(new Date().getTime() - 60000 * 60 * 24 * 35) }
        })
            .select('title price date') // انتخاب فیلدهای مورد نظر
            .sort({ date: -1 }); // مرتب‌سازی بر اساس تاریخ به صورت نزولی

        // بازگشت پاسخ به صورت JSON
        return Response.json({payments});
    } catch (error) {
        // لاگ کردن خطا
        console.log(error);
        // بازگشت پاسخ خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع PUT برای به‌روزرسانی اطلاعات
export async function PUT(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // دریافت userId از پارامترهای جستجو
        const userId = req.nextUrl.searchParams.get('userId')
        // اگر userId ارسال نشده باشد، بازگشت پیام خطا
        if(!userId) return Response.json({message:'یک شناسه ارسال کنید'});
        // حذف نماینده از پرداخت‌های مربوطه
        await PaymentsModel.updateMany({ representative: userId }, { $unset: { representative: 1 } })
        // بازگشت پیام موفقیت‌آمیز
        return Response.json({message:'موفقیت آمیز بود'});
    } catch (error) {
        // لاگ کردن خطا
        console.log(error);
        // بازگشت پاسخ خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
