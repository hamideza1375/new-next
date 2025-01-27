// وارد کردن میان‌افزار authAdminRoutes
import authAdminRoutes from '@/middleware/authAdminRoutes';
// وارد کردن مدل SignModel
import { SignModel } from '@/models/SignModel';
// وارد کردن تابع اتصال به دیتابیس
import dbConnect from '@/utils/dbConnect';

// تابع POST برای ایجاد یا دریافت اطلاعات کاربر
export async function POST(req) {
    try {
        // دریافت ایمیل از پارامترهای جستجو
        const email = req.nextUrl.searchParams.get('email')
        // اتصال به دیتابیس
        await dbConnect();
        // بررسی احراز هویت ادمین
        await authAdminRoutes(req);
        // یافتن کاربر با استفاده از ایمیل
        const user = await SignModel.findOne({email})
        // بازگرداندن اطلاعات کاربر با وضعیت 202
        return Response.json(user,{status:202});
    } catch (error) {
        // بازگرداندن پیام خطا با وضعیت خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع PUT برای به‌روزرسانی وضعیت مسدودیت کاربر
export async function PUT(req) {
    try {
        // دریافت ایمیل از پارامترهای جستجو
        const email = req.nextUrl.searchParams.get('email')
        // اتصال به دیتابیس
        await dbConnect();
        // بررسی احراز هویت ادمین
        await authAdminRoutes(req);
        // یافتن کاربر با استفاده از ایمیل
        const user = await SignModel.findOne({email})
        // تغییر وضعیت مسدودیت کاربر
        user.blocked = user.blocked ? false : true
        // ذخیره تغییرات کاربر
        await user.save()
        // بازگرداندن پیام موفقیت با وضعیت 200
        return Response.json({user, message:!user.blocked ? `کاربر ${user.username} از مسدودیت خارج شد` : `کاربر ${user.username} مسدود شد`},{status:200});
    } catch (error) {
        // بازگرداندن پیام خطا با وضعیت خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع GET برای دریافت لیست کاربران مسدود شده
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // بررسی احراز هویت ادمین
        await authAdminRoutes(req);
        // یافتن کاربران مسدود شده
        const user = await SignModel.find({blocked:true})
        // بازگرداندن لیست کاربران مسدود شده
        return Response.json(user);
    } catch (error) {
        // بازگرداندن پیام خطا با وضعیت خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}