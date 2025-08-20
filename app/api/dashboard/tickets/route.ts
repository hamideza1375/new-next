import authAdminRoutes from '@/middleware/authAdminRoutes'; // وارد کردن میدلور برای احراز هویت ادمین
import { TicketModel } from '@/models/TiketsModel'; // وارد کردن مدل تیکت‌ها
import dbConnect from '@/utils/dbConnect'; // وارد کردن تابع اتصال به دیتابیس
import { NextRequest, NextResponse } from 'next/server'; // وارد کردن نوع‌های Next.js


// این تابع برای دریافت تیکت‌ها است
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        // دریافت شماره صفحه و تعداد آیتم‌ها در هر صفحه از پارامترهای URL
        const pageNumber = Number(req.nextUrl.searchParams.get('page')) || 1;
        const pageSize = Number(req.nextUrl.searchParams.get('limit')) || 1;
        const skipItems = (pageNumber - 1) * pageSize; // محاسبه تعداد آیتم‌هایی که باید رد شوند

        await dbConnect(); // اتصال به دیتابیس
        await authAdminRoutes(); // احراز هویت ادمین
        const tickets = await TicketModel.find() // جستجوی تیکت‌ها در دیتابیس
            .sort({ createdAt: -1 }) // مرتب‌سازی تیکت‌ها بر اساس تاریخ به صورت نزولی
            .skip(skipItems) // رد کردن آیتم‌های محاسبه شده
            .limit(pageSize) // محدود کردن تعداد آیتم‌ها به تعداد مشخص شده
            .select('title message adminSeen createdAt'); // انتخاب فیلدهای مورد نظر
        
        return NextResponse.json(tickets); // بازگرداندن تیکت‌ها به صورت JSON
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: error?.status || 500 }); // بازگرداندن خطا در صورت وقوع
    }
}
