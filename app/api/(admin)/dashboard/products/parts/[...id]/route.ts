import { ProductsModel } from '@/models/ProductModel';
import { IProduct, IPart } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import authAdminRoutes from '@/middleware/authAdminRoutes';
import mongoose from 'mongoose';

interface Params {
    id: string[];
}

interface PartFormData {
    source?: File;
    video?: File;
    title: string;
    description: string;
    chapter: string;
    time?: string;
}


// متد GET برای دریافت یک بخش خاص از محصول
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        if (!params.id[0] || !params.id[1] || !mongoose.Types.ObjectId.isValid(params.id[0])) {
            return NextResponse.json({ error: 'پارامترهای درخواست نامعتبر هستند' }, { status: 400 });
        }

        const product: IProduct | null = await ProductsModel.findById(params.id[0]);
        if (!product) {
            return NextResponse.json({ error: 'محصول یافت نشد' }, { status: 404 });
        }

        const part: IPart | null = product.parts.id(params.id[1]);
        if (!part) {
            return NextResponse.json({ error: 'بخش مورد نظر یافت نشد' }, { status: 404 });
        }

        return NextResponse.json(part);
    } catch (error: any) {
        console.error('خطا در دریافت بخش محصول:', error);
        return NextResponse.json({ error: error?.message || 'خطای سرور' }, { status: error?.status || 500 });
    }
}

// متد POST برای اضافه کردن یک بخش جدید به محصول
export async function POST(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        if (!params.id[0] || !mongoose.Types.ObjectId.isValid(params.id[0])) {
            return NextResponse.json({ error: 'شناسه محصول نامعتبر است' }, { status: 400 });
        }

        const formdata = await req.formData();
        const { source, video, title, description, chapter, time } = Object.fromEntries(
            formdata.entries()
        ) as unknown as PartFormData;

        if (!video?.size || !source?.name) {
            return NextResponse.json({ error: 'ویدئو و فایل منبع الزامی هستند' }, { status: 400 });
        }

        // پردازش ویدئو
        const videoBuffer = Buffer.from(await video.arrayBuffer());
        const videoExt = path.extname(video.name);
        const videoFilename = `${path.basename(video.name, videoExt)}_${chapter}_${params.id[0]}${videoExt}`;
        const videoPath = path.join(process.cwd(), 'assets/uploads/product/', videoFilename);
        writeFileSync(videoPath, videoBuffer);

        // پردازش فایل منبع
        const sourceBuffer = Buffer.from(await source.arrayBuffer());
        const sourceExt = path.extname(source.name);
        const sourceFilename = `${path.basename(source.name, sourceExt)}_${chapter}_${params.id[0]}${sourceExt}`;
        const sourcePath = path.join(process.cwd(), 'assets/uploads/product/', sourceFilename);
        writeFileSync(sourcePath, sourceBuffer);

        // ایجاد بخش جدید
        const newPart = {
            title,
            description,
            chapter: Number(chapter),
            video: videoFilename,
            source: sourceFilename,
            product: params.id[0]
        };

        const product = await ProductsModel.findByIdAndUpdate(
            params.id[0],
            {
                $push: { parts: newPart },
                $inc: { times: Number(time) > 0 ? Number(time) : 600 },
                $set: { createAt: new Date() }
            },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: 'محصول یافت نشد' }, { status: 404 });
        }

        return NextResponse.json({ data: product.parts[product.parts.length - 1] }, { status: 201 });
    } catch (error: any) {
        console.error('خطا در ایجاد بخش جدید:', error);
        return NextResponse.json({ error: error?.message || 'خطای سرور' }, { status: error?.status || 500 });
    }
}

// متد PUT برای ویرایش یک بخش خاص از محصول
export async function PUT(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        if (!params.id[0] || !params.id[1] || !mongoose.Types.ObjectId.isValid(params.id[0])) {
            return NextResponse.json({ error: 'پارامترهای درخواست نامعتبر هستند' }, { status: 400 });
        }

        const formdata = await req.formData();
        const {
            source,
            video,
            title,
            description: description,
            chapter
        } = Object.fromEntries(formdata.entries()) as unknown as PartFormData;

        // یافتن محصول و بخش مورد نظر
        const product = await ProductsModel.findById(params.id[0]);
        if (!product) {
            return NextResponse.json({ error: 'محصول یافت نشد' }, { status: 404 });
        }

        const part: IPart | null = product.parts.id(params.id[1]);
        if (!part) {
            return NextResponse.json({ error: 'بخش مورد نظر یافت نشد' }, { status: 404 });
        }

        // پردازش فایل‌های جدید
        let videoFilename: string | undefined;
        if (video?.size) {
            const videoExt = path.extname(video.name);
            videoFilename = `${path.basename(video.name, videoExt)}_${chapter}_${params.id[0]}${videoExt}`;
            const videoPath = path.join(process.cwd(), 'assets/uploads/product/', videoFilename);
            const videoBuffer = Buffer.from(await video.arrayBuffer());
            writeFileSync(videoPath, videoBuffer);

            // حذف فایل قدیمی
            if (part.video && existsSync(path.join(process.cwd(), 'assets/uploads/product/', part.video))) {
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/', part.video));
            }
        }

        let sourceFilename: string | undefined;
        if (source?.name) {
            const sourceExt = path.extname(source.name);
            sourceFilename = `${path.basename(source.name, sourceExt)}_${chapter}_${params.id[0]}${sourceExt}`;
            const sourcePath = path.join(process.cwd(), 'assets/uploads/product/', sourceFilename);
            const sourceBuffer = Buffer.from(await source.arrayBuffer());
            writeFileSync(sourcePath, sourceBuffer);

            // حذف فایل قدیمی
            if (
                part.source &&
                existsSync(path.join(process.cwd(), 'assets/uploads/product/', part.source))
            ) {
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/', part.source));
            }
        }

        // به‌روزرسانی بخش
        await ProductsModel.updateOne(
            { _id: params.id[0], 'parts._id': params.id[1] },
            {
                $set: {
                    'parts.$.title': title,
                    'parts.$.description': description,
                    'parts.$.chapter': chapter,
                    ...(videoFilename && { 'parts.$.video': videoFilename }),
                    ...(sourceFilename && { 'parts.$.source': sourceFilename })
                }
            }
        );

        return NextResponse.json({ message: 'بخش با موفقیت ویرایش شد' });
    } catch (error: any) {
        console.error('خطا در ویرایش بخش:', error);
        return NextResponse.json({ error: error?.message || 'خطای سرور' }, { status: error?.status || 500 });
    }
}

// متد DELETE برای حذف یک بخش خاص از محصول
export async function DELETE(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        if (!params.id[0] || !params.id[1] || !mongoose.Types.ObjectId.isValid(params.id[0])) {
            return NextResponse.json({ error: 'پارامترهای درخواست نامعتبر هستند' }, { status: 400 });
        }

        // یافتن محصول برای دریافت اطلاعات فایل‌ها قبل از حذف
        const product = await ProductsModel.findById(params.id[0]);
        if (!product) {
            return NextResponse.json({ error: 'محصول یافت نشد' }, { status: 404 });
        }

        const part: IPart | null = product.parts.id(params.id[1]);
        if (!part) {
            return NextResponse.json({ error: 'بخش مورد نظر یافت نشد' }, { status: 404 });
        }

        // حذف بخش
        const result = await ProductsModel.updateOne(
            { _id: params.id[0] },
            { $pull: { parts: { _id: params.id[1] } } }
        );

        if (!result.modifiedCount) {
            return NextResponse.json({ error: 'حذف بخش انجام نشد' }, { status: 400 });
        }

        // حذف فایل‌های مرتبط
        if (part.video && existsSync(path.join(process.cwd(), 'assets/uploads/product/', part.video))) {
            unlinkSync(path.join(process.cwd(), 'assets/uploads/product/', part.video));
        }

        if (part.source && existsSync(path.join(process.cwd(), 'assets/uploads/product/', part.source))) {
            unlinkSync(path.join(process.cwd(), 'assets/uploads/product/', part.source));
        }

        return NextResponse.json({ message: 'بخش با موفقیت حذف شد' });
    } catch (error: any) {
        console.error('خطا در حذف بخش:', error);
        return NextResponse.json({ error: error?.message || 'خطای سرور' }, { status: error?.status || 500 });
    }
}
