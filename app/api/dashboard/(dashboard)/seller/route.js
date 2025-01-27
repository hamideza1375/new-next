// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { SignModel } from '@/models/SignModel';
import dbConnect from '@/utils/dbConnect';

// تابع POST برای اضافه کردن فروشنده
export async function POST(req) {
    try {
        // دریافت داده‌ها از درخواست
        const { phone, creditCard } = await req.json();
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // جستجوی کاربر بر اساس ایمیل
        const user = await SignModel.findOne({email:phone});
        // بررسی وجود کاربر
        if(!user) return Response.json('کاربری با این مشخصات پیدا نشد',{status:400})
        // بررسی اینکه کاربر قبلاً فروشنده شده است یا نه
        if(user.sellerId) return Response.json('این کاربر قبلا به لیست فروشنده ا اضاف شد',{status:400})
        // تنظیم شناسه فروشنده و کارت اعتباری
        user.sellerId = user._id
        user.creditCard = creditCard
        // ذخیره تغییرات
        await user.save()
        // بازگشت پاسخ موفقیت‌آمیز
        return Response.json({message:`${user.username} با موفقیت از لیست فروشنده ها حذف شد` });
    } catch (error) {
        // بازگشت پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع PUT برای حذف فروشنده
export async function PUT(req) {
    try {
        // دریافت داده‌ها از درخواست
        const { phone } = await req.json();
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // جستجوی کاربر بر اساس ایمیل
        const user = await SignModel.findOne({email:phone});
        // بررسی وجود کاربر
        if(!user) return Response.json('کاربری با این مشخصات پیدا نشد',{status:400})
        // بررسی اینکه کاربر فروشنده است یا نه
        if(!user.sellerId) return Response.json('فروشنده ای با این مشخصات پیدا نشد',{status:400})
        // حذف شناسه فروشنده
        user.sellerId = undefined
        // ذخیره تغییرات
        await user.save()
        // بازگشت پاسخ موفقیت‌آمیز
        return Response.json({message:`${user.username} با موفقیت از لیست فروشنده ها حذف شد` });
    } catch (error) {
        // لاگ کردن خطا و بازگشت پاسخ خطا
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع GET برای دریافت لیست فروشنده‌ها
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // جستجوی کاربران که فروشنده هستند
        const user = await SignModel.find({ sellerId: { $ne: undefined } });
        // بازگشت لیست فروشنده‌ها
        return Response.json(user);
    } catch (error) {
        // بازگشت پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
