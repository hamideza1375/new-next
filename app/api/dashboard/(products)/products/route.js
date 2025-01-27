// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { writeFileSync } from 'fs';
import { NextRequest, NextResponse as res } from 'next/server';
import path from 'path';

// تابع برای مدیریت درخواست POST
/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */
export async function POST(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);

        // دریافت داده‌های فرم از درخواست
        const formdata = await req.formData(); // formData به req وابسهه هست
        const { image, video, title, price, info, des, time } = Object.fromEntries(formdata.entries());

        // بررسی دریافت فایل‌ها
        if (!image || !video) return res.json({ error: 'No files received.', status: 400 }, { status: 400 });

        // تبدیل تصویر به بافر و ایجاد نام فایل
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = Date.now().toString('32') + '_' + image.name;

        // تبدیل ویدیو به بافر و ایجاد نام فایل
        const videoBuffer = Buffer.from(await video.arrayBuffer());
        const videoFilenameSplit = video.name.split('.')
        const videoFilename = videoFilenameSplit[0] + '_1' + `_0_` + '.' + videoFilenameSplit[1];

        // ذخیره فایل‌ها در مسیر مشخص شده
        writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + filename), buffer);
        writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + videoFilename), videoBuffer);

        // ایجاد محصول جدید در دیتابیس
        const product = await ProductsModel.create({
            title,
            price,
            info,
            des,
            imageUrl: filename,
            videoUrl: videoFilename,
            times: (Number(time) > 0 ? Number(time) : 300),
            categoryId: req.nextUrl.searchParams.get('categoryId')
        });
        return res.json({ dt: product, message: {} }, { status: 201 });
    } catch (error) {
        // مدیریت خطاها
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع برای مدیریت درخواست GET
export async function GET(req) {
    const {
        nextUrl: { searchParams }
    } = req;
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // احراز هویت ادمین
        await authAdminRoutes(req);
        // دریافت محصولات از دیتابیس بر اساس دسته‌بندی
        let products = await ProductsModel.find({
            categoryId: searchParams.get('categoryId')
        }).sort({ createAt: -1 });
        return res.json(products, { status: 200 });
    } catch (error) {
        // مدیریت خطاها
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
