// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { writeFileSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// تعریف نوع‌های داده‌ای برای درخواست‌های ورودی و خروجی
interface ProductFormData {
    image: File;
    video: File;
    title: string;
    price: number;
    info: string;
    description: string;
    time: number;
}


// تابع برای مدیریت درخواست POST
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        await authAdminRoutes();

        // دریافت داده‌های فرم از درخواست
        const formdata = await req.formData();
        const { image, video, title, price, info, description, time } = Object.fromEntries(formdata.entries()) as unknown as ProductFormData;

        if (!image || !video) {
            return NextResponse.json({ error: 'No files received.', status: 400 }, { status: 400 });
        }

        // تبدیل تصویر به بافر و ایجاد نام فایل
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now().toString(32)}_${image.name}`;

        // تبدیل ویدیو به بافر و ایجاد نام فایل
        const videoBuffer = Buffer.from(await video.arrayBuffer());
        const videoFilenameSplit = video.name.split('.');
        const videoFilename = `${videoFilenameSplit[0]}_1_0_.${videoFilenameSplit[1]}`;

        // ذخیره فایل‌ها در مسیر مشخص شده
        writeFileSync(path.join(process.cwd(), `assets/uploads/product/${filename}`), buffer);
        writeFileSync(path.join(process.cwd(), `assets/uploads/product/${videoFilename}`), videoBuffer);

        // ایجاد محصول جدید در دیتابیس
        const product = await ProductsModel.create({
            title,
            price: Number(price),
            info,
            description: description,
            image: filename,
            video: videoFilename,
            times: Number(time) > 0 ? Number(time) : 300,
            categoryId: req.nextUrl.searchParams.get('categoryId')
        });

        return NextResponse.json({ dt: product, message: {} }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: error?.status || 500 });
    }
}

// تابع برای مدیریت درخواست GET
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        const categoryId = req.nextUrl.searchParams.get('categoryId');

        const products = await ProductsModel.find({ categoryId }).sort({ createAt: -1 });

        return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: error?.status || 500 });
    }
}
