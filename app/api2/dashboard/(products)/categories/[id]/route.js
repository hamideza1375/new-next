// وارد کردن مدل دسته‌بندی‌ها
import { CategoriesModel } from '@/models/CategoriesModel';
// وارد کردن تابع اتصال به دیتابیس
import dbConnect from '@/utils/dbConnect';
// وارد کردن توابع نوشتن فایل و بررسی وجود فایل
import { writeFile } from 'fs/promises';
import { existsSync, unlinkSync } from 'fs';
// وارد کردن توابع مربوط به درخواست و پاسخ در Next.js
import { NextRequest, NextResponse, NextResponse as res } from 'next/server';
// وارد کردن ماژول مسیر
import path from 'path';
// وارد کردن میان‌افزار احراز هویت برای مسیرهای ادمین
import authAdminRoutes from '@/middleware/authAdminRoutes';

/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

// تابع GET برای دریافت دسته‌بندی بر اساس شناسه
export async function GET(req, { params }) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // پیدا کردن دسته‌بندی بر اساس شناسه
        const category = await CategoriesModel.findById(params.id);
        // بازگشت پاسخ به صورت JSON
        return NextResponse.json(category);
    } catch (error) {
        // بازگشت خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع PUT برای به‌روزرسانی دسته‌بندی بر اساس شناسه
export async function PUT(req, { params }) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);

        // پیدا کردن دسته‌بندی بر اساس شناسه
        const category = await CategoriesModel.findById(params.id);

        // اگر دسته‌بندی پیدا نشد، بازگشت خطا
        if (!category) return Response.json('این گزینه از سرور حذف شده است', { status: 400 });

        // دریافت داده‌های فرم
        const formData = await req.formData();
        const file = formData.get('image');
        const title = formData.get('title');

        // اگر فایل تصویر وجود داشت
        if (file) {
            // تبدیل فایل به بافر
            const buffer = Buffer.from(await file.arrayBuffer());
            // تولید نام فایل جدید
            const filename = Date.now().toString('32') + '' + Math.floor(Math.random() * 99999 + 10000) + '_' + file.name;
            // نوشتن فایل در مسیر مشخص شده
            await writeFile(path.join(process.cwd(), 'assets/uploads/product/' + filename), buffer);
            // اگر فایل قبلی وجود داشت، حذف آن
            if (existsSync(path.join(process.cwd(), 'assets/uploads/product/' + category.imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/' + category.imageUrl));
            // به‌روزرسانی عنوان و مسیر تصویر دسته‌بندی
            category.title = title;
            category.imageUrl = filename;
            // ذخیره تغییرات
            await category.save();
        } else {
            // به‌روزرسانی عنوان دسته‌بندی
            category.title = title;
            // ذخیره تغییرات
            await category.save();
        }
        // بازگشت پاسخ به صورت JSON
        return NextResponse.json({ dt: category });
    } catch (error) {
        // بازگشت خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع DELETE برای حذف دسته‌بندی بر اساس شناسه
// export async function DELETE(req, { params }) {
//     try {
//         // اتصال به دیتابیس
//         await dbConnect();
//         // احراز هویت ادمین
//         await authAdminRoutes(req);
//         // پیدا کردن و حذف دسته‌بندی بر اساس شناسه
//         const category = await CategoriesModel.findByIdAndDelete(params.id);
//         // اگر دسته‌بندی پیدا نشد، بازگشت خطا
//         if (!category) return Response.json('دسته ای با این مشخصات پیدا نشد', { status: 404 });
//         // بازگشت پاسخ به صورت JSON
//         return NextResponse.json({ dt: category });
//     } catch (error) {
//         // بازگشت خطا به صورت JSON
//         return Response.json(error?.message, { status: (error && error.status) || 500 });
//     }
// }
