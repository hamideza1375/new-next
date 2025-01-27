// وارد کردن ماژول‌های مورد نیاز
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
// import { writeFile } from 'fs/promises';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { NextRequest, NextResponse, NextResponse as res } from 'next/server';
import path from 'path';
import authAdminRoutes from '@/middleware/authAdminRoutes';

/** @param {NextRequest} req * @param {() => void} * @param {res} res * @param {() => void} */

// متد GET برای دریافت یک بخش خاص از محصول
export async function GET(req, { params }) {
    try {
        await dbConnect();
        await authAdminRoutes(req);
        const product = await ProductsModel.findById(params.id[0]);
        const part = product?.parts.id(params.id[1]);
        return NextResponse.json(part);
    } catch (error) {
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// متد POST برای اضافه کردن یک بخش جدید به محصول
export async function POST(req, { params }) {
    try {
        await dbConnect();
        await authAdminRoutes(req);

        const formdata = await req.formData();
        const { source, video, title, des, chapter, time } = Object.fromEntries(formdata.entries());

        if (!video?.size || !source?.name) return res.json('یک ویدئو انتخاب کنید', { status: 400 });

        const videoBuffer = Buffer.from(await video.arrayBuffer());

        const videoFilenameSplit = video.name.split('.')
        const videoFilename = videoFilenameSplit[0] + `_${chapter}` + `_${params.id[0]}_` + '.' + videoFilenameSplit[1];

        writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + videoFilename), videoBuffer);

        const sourceBuffer = Buffer.from(await source.arrayBuffer());
        const sourceFilenameSplit = source.name.split('.')
        const sourceFilename = sourceFilenameSplit[0] + `_${chapter}` + `_${params.id[0]}_` + '.' + sourceFilenameSplit[1];
        
        writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + sourceFilename), sourceBuffer);

        const product = await ProductsModel.findById(params.id[0]);
        product.parts.push({ title, des, chapter, videoUrl: videoFilename, sourceUrl: sourceFilename, productId: params.id[0] });
       
        product.createAt = new Date();

        product.times = (Number(product.times)) + (Number(time) > 0 ? Number(time) : 600)
        await product.save();

        return NextResponse.json({ dt: product.parts.pop() }, { status: 201 });
    } catch (error) {
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// متد PUT برای ویرایش یک بخش خاص از محصول
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        await authAdminRoutes(req);

        const formdata = await req.formData();
        const { source, video, title, des, chapter } = Object.fromEntries(formdata.entries());

        const videoFilenameSplit =video?.size && video.name.split('.')
        const videoFilename =video?.size && videoFilenameSplit[0] + `_${chapter}` + `_${params.id[0]}_` + '.' + videoFilenameSplit[1];

        const sourceFilenameSplit =source?.name && source.name.split('.')
        const sourceFilename =source?.name && sourceFilenameSplit[0] + `_${chapter}` + `_${params.id[0]}_` + '.' + sourceFilenameSplit[1];


        let product = await ProductsModel.findOneAndUpdate( 
            { _id: params.id[0], 'parts._id': params.id[1] },
            {
                $set: {
                    'parts.$.title': title,
                    'parts.$.des': des,
                    'parts.$.chapter': chapter,
                    ...(video?.size && { 'parts.$.videoUrl': videoFilename }),
                    ...(source?.name && { 'parts.$.sourceUrl': sourceFilename })
                }
            }
            // { new: true }
        );
        const oldSourceUrl = product?.parts.id(params.id[1])?.sourceUrl;
        const oldVideoURL = product?.parts.id(params.id[1])?.videoUrl;


        if (video?.size && oldVideoURL) {
            if (existsSync(path.join(process.cwd(), 'assets/uploads/product/' + oldVideoURL)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/' + oldVideoURL));
            const buffer = Buffer.from(await video.arrayBuffer());
            writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + videoFilename), buffer);
        }

        if (source?.name && oldSourceUrl) {
            if (existsSync(path.join(process.cwd(), 'assets/uploads/product/' + oldSourceUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/' + oldSourceUrl));
            const buffer = Buffer.from(await source.arrayBuffer());
            writeFileSync(path.join(process.cwd(), 'assets/uploads/product/' + sourceFilename), buffer);
        }

        return NextResponse.json({ message: 'با موفقیت ویرایش شد' });
    } catch (error) {
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// متد DELETE برای حذف یک بخش خاص از محصول
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        await authAdminRoutes(req);
        // const category = await ProductsModel.findOneAndDelete({'parts._id':params.id[0]});
        const part = await ProductsModel.updateOne(
            { _id: params.id[0] },
            { $pull: { parts: { _id: params.id[1] } } }
        );
        if (!part.modifiedCount) return Response.json('دسته ای با این مشخصات پیدا نشد', { status: 404 });
        // if (!part) return Response.json('دسته ای با این مشخصات پیدا نشد', { status: 404 });

        const oldSourceUrl = product?.parts.id(params.id[1])?.sourceUrl;
        const oldVideoURL = product?.parts.id(params.id[1])?.videoUrl;

        if (oldVideoURL) {
            if (existsSync(path.join(process.cwd(), 'assets/uploads/product/' + oldVideoURL)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/' + oldVideoURL));
        }

        if (oldSourceUrl) {
            if (existsSync(path.join(process.cwd(), 'assets/uploads/product/' + oldSourceUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/product/' + oldSourceUrl));
        }

        return NextResponse.json({ message: 'با موفقیت حذف شد' });
    } catch (error) {
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
