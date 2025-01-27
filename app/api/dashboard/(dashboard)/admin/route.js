import authAdminRoutes from '@/middleware/authAdminRoutes';
import { SignModel } from '@/models/SignModel';
import dbConnect from '@/utils/dbConnect';

// تابع POST برای اضافه کردن ادمین
export async function POST(req) {
    try {
        // دریافت داده های ورودی از درخواست
        const { phone } = await req.json();
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // جستجوی کاربر بر اساس ایمیل
        const user = await SignModel.findOne({email:phone});
        // بررسی وجود کاربر
        if(!user) return Response.json('کاربری با این مشخصات پیدا نشد',{status:400})
        // بررسی اینکه کاربر قبلا ادمین شده است یا نه
        if(user.isAdmin) return Response.json('این کاربر قبلا به لیست ادمین ا اضاف شد',{status:400})
        // تنظیم سطح دسترسی ادمین
        user.isAdmin = 2
        // ذخیره تغییرات
        await user.save()
        // ارسال پاسخ موفقیت آمیز
        return Response.json({message:`${user.username} با موفقیت از لیست ادمین ها حذف شد` });
    } catch (error) {
        // لاگ کردن خطا
        console.log(error);
        // ارسال پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع PUT برای حذف ادمین
export async function PUT(req) {
    try {
        // دریافت داده های ورودی از درخواست
        const { phone } = await req.json();
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // جستجوی ادمین بر اساس ایمیل
        const admin = await SignModel.findOne({email:phone});
        // بررسی وجود ادمین
        if(!admin) return Response.json('کاربری با این مشخصات پیدا نشد',{status:400})
        // بررسی اینکه کاربر ادمین است یا نه
        if(!admin.isAdmin) return Response.json('ادمینی با این مشخصات پیدا نشد',{status:400})
        // بررسی سطح دسترسی ادمین
        if(admin.isAdmin == 1) return Response.json('خطا',{status:400})
        
        // حذف سطح دسترسی ادمین
        await SignModel.updateOne({ email:phone },{ $unset: { isAdmin: 1 } });
            
        // ارسال پاسخ موفقیت آمیز
        return Response.json({message:`${admin.username} با موفقیت از لیست ادمین ها حذف شد` });
    } catch (error) {
        // لاگ کردن خطا
        console.log(error);
        // ارسال پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع GET برای دریافت لیست ادمین ها
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // جستجوی ادمین ها
        const admins = await SignModel.find({ isAdmin: { $gt: 0 } });
        // ارسال لیست ادمین ها
        return Response.json(admins);
    } catch (error) {
        // ارسال پاسخ خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
