import authUserRoutes from '@/middleware/authUserRoutes';
import optimizeImage from '@/middleware/imageUpload';
import errorHandling from '@/middleware/errorHandling';
import { ObjectId, ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync } from 'fs';
import mongoose from 'mongoose';
import path from 'path';

// تابع POST برای اضافه کردن پاسخ به سوال
export async function POST(req, { params }) {
    return errorHandling(async () => {
        await dbConnect(); // اتصال به دیتابیس
        await authUserRoutes(req); // احراز هویت کاربر
        const formdata = await req.formData(); // دریافت داده‌های فرم
        const { message, image } = Object.fromEntries(formdata); // استخراج پیام و تصویر از داده‌های فرم

        const _user = JSON.parse(req.headers.get('user')); // دریافت اطلاعات کاربر از هدر
        if (!_user) return Response.json('شما مجوز این کار را ندارید', { status: 429 }); // بررسی مجوز کاربر

        const filename = await optimizeImage(image); // بهینه‌سازی تصویر

        const product = await ProductsModel.updateOne(
            { 'questions._id': params.id }, // جستجوی سوال بر اساس آیدی
            {
                $set: { 'questions.$.date': new Date() }, // به‌روزرسانی تاریخ سوال
                $push: {
                    'questions.$.answer': {
                        email: !_user.isAdmin ? _user.email : 'admin', // تنظیم ایمیل پاسخ‌دهنده
                        message, // تنظیم پیام
                        date: new Date(), // تنظیم تاریخ
                        ...(filename && { imageUrl: filename }) // تنظیم آدرس تصویر در صورت وجود
                    }
                }
            },
            { new: true }
        );

        // دریافت پاسخ‌های سوال
        const questions = await ProductsModel.aggregate([
            { $unwind: '$questions' },
            { $match: { 'questions._id': new mongoose.Types.ObjectId(params.id) } },
            { $replaceRoot: { newRoot: '$questions' } },
            { $project: { answer: 1 } }
        ]);

        return Response.json({ message: 'ساخته شد', dt: questions[0]?.answer?.pop() }); // ارسال پاسخ به کلاینت
    });
}

// تابع GET برای دریافت پاسخ سوال
export async function GET(req, { params }) {
    await dbConnect(); // اتصال به دیتابیس
    const answer = await ProductsModel.aggregate([
        { $unwind: '$questions' },
        { $unwind: '$questions.answer' },
        { $match: { 'questions.answer._id': new ObjectId(params.id) } },
        { $replaceRoot: { newRoot: '$questions.answer' } }
    ]);

    return Response.json(answer[0] || {}); // ارسال پاسخ به کلاینت
}

// تابع PUT برای به‌روزرسانی پاسخ سوال
export async function PUT(req, { params }) {
    return errorHandling(async () => {
        await dbConnect(); // اتصال به دیتابیس
        await authUserRoutes(req); // احراز هویت کاربر

        const _user = JSON.parse(req.headers.get('user')); // دریافت اطلاعات کاربر از هدر
        const formdata = await req.formData(); // دریافت داده‌های فرم
        const { message, image } = Object.fromEntries(formdata); // استخراج پیام و تصویر از داده‌های فرم

        const questionQuestion = await ProductsModel.aggregate([
            { $unwind: '$questions' },
            { $unwind: '$questions.answer' },
            { $match: { 'questions.answer._id': new ObjectId(params.id) } },
            { $replaceRoot: { newRoot: '$questions.answer' } }
        ]);

        if (!_user.isAdmin && questionQuestion[0]?.email !== _user.email)
            return Response.json('شما مجوز این کار را ندارید', { status: 429 }); // بررسی مجوز کاربر

        if (image?.size) {
            if (questionQuestion[0]?.imageUrl) {
                if (
                    existsSync(
                        path.join(process.cwd(), 'assets/uploads/question/' + questionQuestion[0].imageUrl)
                    )
                )
                    unlinkSync(
                        path.join(process.cwd(), 'assets/uploads/question/' + questionQuestion[0].imageUrl)
                    ); // حذف تصویر قدیمی
            }
        }

        const filename = await optimizeImage(image); // بهینه‌سازی تصویر

        const updatedAnswer = await ProductsModel.findOneAndUpdate(
            { 'questions.answer._id': params.id }, // جستجوی پاسخ بر اساس آیدی
            {
                $set: {
                    'questions.$.answer.$[elem].message': message, // به‌روزرسانی پیام
                    ...(filename && { 'questions.$.answer.$[elem].imageUrl': filename }) // به‌روزرسانی آدرس تصویر در صورت وجود
                }
            },
            {
                arrayFilters: [{ 'elem._id': params.id }], // فیلتر کردن آرایه بر اساس آیدی
                new: true
            }
        );

        return Response.json({
            message: 'به‌روزرسانی شد',
            dt: { imageUrl: filename, message, _id: params.id, date: new Date() } // ارسال پاسخ به کلاینت
        });
    });
}

// تابع DELETE برای حذف پاسخ سوال
export async function DELETE(req, { params }) {
    return errorHandling(async () => {
        await dbConnect(); // اتصال به دیتابیس
        const _user = JSON.parse(req.headers.get('user')); // دریافت اطلاعات کاربر از هدر

        const questionQuestion = await ProductsModel.aggregate([
            { $unwind: '$questions' },
            { $unwind: '$questions.answer' },
            { $match: { 'questions.answer._id': new ObjectId(params.id) } },
            { $replaceRoot: { newRoot: '$questions.answer' } }
        ]);

        if (!_user.isAdmin && questionQuestion[0]?.email !== _user.email)
            return Response.json('شما مجوز این کار را ندارید', { status: 429 }); // بررسی مجوز کاربر

        if (questionQuestion[0]?.imageUrl) {
            if (existsSync(path.join(process.cwd(), 'assets/uploads/question/' + questionQuestion[0].imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/question/' + questionQuestion[0].imageUrl)); // حذف تصویر
        }

        const updatedProduct = await ProductsModel.findOneAndUpdate(
            { 'questions.answer._id': params.id }, // جستجوی پاسخ بر اساس آیدی
            {
                $pull: { 'questions.$.answer': { _id: params.id } } // حذف پاسخ
            }
            // {
            //     new: true
            // }
        );

        return Response.json({ message: 'حذف شد' }); // ارسال پاسخ به کلاینت
    });
}
