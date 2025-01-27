// وارد کردن ماژول‌های مورد نیاز
import authUserRoutes from '@/middleware/authUserRoutes';
import optimizeImage from '@/middleware/imageUpload';
import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync } from 'fs';
import path from 'path';

// متد GET برای دریافت یک سوال خاص
export async function GET(req, { params }) {
    await dbConnect(); // اتصال به دیتابیس
    const product = await ProductsModel.findOne({ 'questions._id': params.id }, { 'questions.$': 1 }); // پیدا کردن محصول با سوال خاص

    const question = product.questions.id(params.id); // دریافت سوال

    const _question = {
        username: question.username,
        message: question.message,
        imageUrl: question.imageUrl,
        date: question.date
    };

    return Response.json(_question); // بازگرداندن سوال به صورت JSON
}

// متد PUT برای به‌روزرسانی یک سوال خاص
export async function PUT(req, { params }) {
    return errorHandling(async()=>{

        await dbConnect(); // اتصال به دیتابیس
        await authUserRoutes(req); // احراز هویت کاربر

    const _user = JSON.parse(req.headers.get('user')); // دریافت اطلاعات کاربر از هدر
    const formdata = await req.formData(); // دریافت داده‌های فرم
    const { title, message, image } = Object.fromEntries(formdata); // استخراج داده‌های فرم

    const product = await ProductsModel.findOne({ 'questions._id': params.id }) // پیدا کردن محصول با سوال خاص

    const question = product.questions.id(params.id); // دریافت سوال

    if ((question.email !== _user.email) && !_user.isAdmin) return Response.json('شما مجوز این کار را ندارید', { status: 429 }); // بررسی مجوز کاربر

    if (image?.size) { // بررسی وجود تصویر
        if (question?.imageUrl) {
            if (existsSync(path.join(process.cwd(), 'assets/uploads/question/' + question.imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/question/' + question.imageUrl)); // حذف تصویر قبلی
        }
    }

    const filename = await optimizeImage(image); // بهینه‌سازی تصویر جدید

    question.date = new Date(); // به‌روزرسانی تاریخ سوال
    question.message = message; // به‌روزرسانی پیام سوال
    if (filename) question.imageUrl = filename; // به‌روزرسانی آدرس تصویر
    if (_user.isAdmin) question.seen = true; // به‌روزرسانی وضعیت مشاهده سوال برای ادمین
    else question.seen = false;

    await product.save(); // ذخیره تغییرات در دیتابیس

    return Response.json({ message: 'عملیات موفق آمیز', dt: question }); // بازگرداندن پاسخ به صورت JSON
})
}

// متد DELETE برای حذف یک سوال خاص
export async function DELETE(req, { params }) {
    return errorHandling(async()=>{

    await dbConnect(); // اتصال به دیتابیس

    const product = await ProductsModel.findOne({ 'questions._id': params.id }) // پیدا کردن محصول با سوال خاص

    const question = product.questions.id(params.id); // دریافت سوال

    const _user = JSON.parse(req.headers.get('user')); // دریافت اطلاعات کاربر از هدر
    if ((question.email !== _user.email) && !_user.isAdmin)
        return Response.json('شما مجوز این کار را ندارید', { status: 429 }); // بررسی مجوز کاربر

    if (question?.imageUrl) { // بررسی وجود تصویر
        if (existsSync(path.join(process.cwd(), 'assets/uploads/question/' + question.imageUrl)))
            unlinkSync(path.join(process.cwd(), 'assets/uploads/question/' + question.imageUrl)); // حذف تصویر سوال
    }

    question.answer.forEach(item => { // حذف تصاویر پاسخ‌ها
        if (item?.imageUrl)
            if (existsSync(path.join(process.cwd(), 'assets/uploads/question/' + item.imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/question/' + item.imageUrl));
    });

    product.questions.pull(question); // حذف سوال از محصول

    await product.save(); // ذخیره تغییرات در دیتابیس

    return Response.json({message:'با موفقیت حذف شد'}); // بازگرداندن پاسخ به صورت JSON
})
}
