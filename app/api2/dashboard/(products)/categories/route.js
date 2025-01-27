// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { CategoriesModel } from '@/models/CategoriesModel';
import dbConnect from '@/utils/dbConnect';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse as res } from 'next/server';
import path from 'path';

/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

// تابع POST برای ایجاد دسته‌بندی جدید
export async function POST(req) {
    try {
        await dbConnect(); // اتصال به دیتابیس
        await authAdminRoutes(req); // احراز هویت ادمین
        const formData = await req.formData(); // دریافت داده‌های فرم

        const file = formData.get('image'); // دریافت فایل تصویر
        const title = formData.get('title'); // دریافت عنوان دسته‌بندی
        if (!file) return res.json({ error: 'No files received.', status: 400 }, { status: 400 }); // بررسی وجود فایل

        const buffer = Buffer.from(await file.arrayBuffer()); // تبدیل فایل به بافر
        const filename = Date.now().toString('32') + '' + Math.floor(Math.random() * 99999 + 10000) + '_' + file.name; // تولید نام فایل

        await writeFile(path.join(process.cwd(), 'assets/uploads/product/' + filename), buffer); // ذخیره فایل در مسیر مشخص
        const category = await CategoriesModel.create({ title: title, imageUrl: filename }); // ایجاد دسته‌بندی جدید در دیتابیس

        return res.json({ message: 'ساخته شد', dt: category }, { status: 201 }); // ارسال پاسخ موفقیت
    } catch (error) {
        return res.json(error?.message, { status: (error && error.status) || 500 }); // ارسال پاسخ خطا
    }
}

// تابع GET برای دریافت دسته‌بندی‌ها
export async function GET(req) {
    try {
        await dbConnect(); // اتصال به دیتابیس
        await authAdminRoutes(req); // احراز هویت ادمین
        const categories = await CategoriesModel.find(); // دریافت دسته‌بندی‌ها از دیتابیس
        return Response.json(categories); // ارسال پاسخ با داده‌های دسته‌بندی
    } catch (error) {
        return Response.json(error?.message, { status: (error && error.status) || 500 }); // ارسال پاسخ خطا
    }
}
