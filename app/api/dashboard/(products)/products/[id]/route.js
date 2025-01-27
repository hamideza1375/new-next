// وارد کردن مدل محصولات
import { ProductsModel } from '@/models/ProductModel';

// وارد کردن میان‌افزار احراز هویت مدیر
import authAdminRoutes from '@/middleware/authAdminRoutes';
// وارد کردن تابع اتصال به پایگاه داده
import dbConnect from '@/utils/dbConnect';
// وارد کردن توابع سیستم فایل
import { existsSync, unlinkSync, writeFileSync } from 'fs';
// وارد کردن توابع Next.js برای پاسخ‌دهی به درخواست‌ها
import { NextRequest, NextResponse, NextResponse as res } from 'next/server';
// وارد کردن ماژول مسیر
import path from 'path';

// تنظیمات صفحه (کامنت شده)
// /** @type {import('next').PageConfig} */
// export const config = {
// 	api: {
// 		 responseLimit:'1kb'
// 	}
// };

/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

// تابع GET برای دریافت اطلاعات محصول
export async function GET(req, { params }) {
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        // احراز هویت مدیر
        await authAdminRoutes(req);
        // پیدا کردن محصول با استفاده از شناسه
        let product = await ProductsModel.findById(params.id);
        // بازگشت اطلاعات محصول به صورت JSON
        return NextResponse.json(product);
    } catch (error) {
        // بازگشت خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

// تابع PUT برای به‌روزرسانی اطلاعات محصول
export async function PUT(req, { params }) {
    try {
        // اتصال به پایگاه داده
        await dbConnect();
        // احراز هویت مدیر
        await authAdminRoutes(req);

        // ...existing code...

        // پیدا کردن محصول با استفاده از شناسه
        let product = await ProductsModel.findById(params.id);

        // اگر محصول پیدا نشد، بازگشت خطا
        if (!product) return Response.json('این گزینه از سرور حذف شده است', { status: 400 });

        // دریافت داده‌های فرم
        const formdata = await req.formData();
        
        // استخراج داده‌های فرم
        const { image, video, title, price, des, info } = Object.fromEntries(formdata.entries());

        let imagname, videoname;

        // اگر تصویر وجود داشت، ذخیره آن
        if (image?.size) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = Date.now().toString('32') + '' + Math.floor(Math.random() * 99999 + 10000) + '_' + image.name;
            if (existsSync(path.join(process.cwd(), 'assets/uploads/product/' + product.imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/' + product.imageUrl));
            writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + filename), buffer);
            imagname = filename;
        }
        // اگر ویدیو وجود داشت، ذخیره آن
        if (video?.size) {
            const buffer = Buffer.from(await video.arrayBuffer());
            const videoFilenameSplit = video.name.split('.')
            const videoFilename = videoFilenameSplit[0] + '_1' + `_0_` + '.' + videoFilenameSplit[1];
            if (existsSync(path.join(process.cwd(), 'assets/uploads/product/' + product.videoUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/' + product.videoUrl));
            writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + videoFilename), buffer);
            videoname = videoFilename;
        }
        // به‌روزرسانی اطلاعات محصول
        product.title = title;
        product.price = price;
        product.des = des;
        product.info = info;
        product.createAt = new Date();
        if (imagname) product.imageUrl = imagname;
        if (videoname) product.videoUrl = videoname;
        await product.save();
        // بازگشت اطلاعات به‌روزرسانی شده محصول به صورت JSON
        return NextResponse.json({ dt: product });
    } catch (error) {
        // بازگشت خطا به صورت JSON
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// تابع DELETE برای حذف محصول (کامنت شده)
// export async function DELETE(req, { params }) {
//     try {
//         await dbConnect();
//         await authAdminRoutes(req);
//         const product = await ProductsModel.findByIdAndDelete(params.id);
//         // const category = await CategoriesModel.findByIdAndDelete(product.categoryID);
//         if (!product) return Response.json('دسته ای با این مشخصات پیدا نشد', { status: 404 });
//         return NextResponse.json({ dt: product });
//     } catch (error) {
//         return Response.json(error?.message, { status: (error && error.status) || 500 });
//     }
// }
