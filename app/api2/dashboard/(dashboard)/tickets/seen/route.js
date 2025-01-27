// وارد کردن توابع و مدل‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { TicketModel } from '@/models/Tikets';
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت تعداد تیکت‌های دیده نشده توسط ادمین
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // شمارش تعداد تیکت‌های دیده نشده
        let countSeen = await TicketModel.find({ adminSeen: 0 }).countDocuments();
        // بازگشت تعداد تیکت‌های دیده نشده به صورت JSON
        return Response.json(countSeen);
    } catch (error) {
        // بازگشت پیام خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع POST برای به‌روزرسانی وضعیت دیده شدن تیکت توسط ادمین
export async function POST(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن تیکت با استفاده از ID
        const ticket = await TicketModel.findOne({ _id: req.nextUrl.searchParams.get('tiketID') });
        // به‌روزرسانی وضعیت دیده شدن تیکت
        ticket.adminSeen = 1;
        // ذخیره تغییرات در دیتابیس
        await ticket.save();
        // بازگشت پاسخ خالی به صورت JSON
        return Response.json('');
    } catch (error) {
        // بازگشت پیام خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
