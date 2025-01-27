// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { TicketModel } from '@/models/Tikets';
import dbConnect from '@/utils/dbConnect';

// جعبه پاسخ
export async function GET(req) {
    // استخراج پارامترهای جستجو از URL درخواست
    const { nextUrl: { searchParams } } = req
    try {
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // اتصال به پایگاه داده
        await dbConnect();
        // یافتن تیکت با استفاده از ID و انتخاب فیلدهای مورد نظر
        const getAnswersTicket = await TicketModel.findById(searchParams.get('ticketID')).select({
            userSeen: 0,
            adminSeen: 0
        }).populate('userId', '-_id username email')

        // معکوس کردن ترتیب پاسخ‌ها
        const answer = getAnswersTicket.answer.reverse();
        
        // تبدیل تیکت به شیء
        let ticketObject = getAnswersTicket.toObject();
        
        // حذف فیلد پاسخ از شیء تیکت
        delete ticketObject.answer;

        // بازگرداندن پاسخ‌ها به همراه شیء تیکت
        return Response.json([...answer, ticketObject]);
    } catch (error) {
        // ثبت خطا در کنسول
        console.log(error);
        // بازگرداندن پیام خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
