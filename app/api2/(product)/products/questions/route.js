// وارد کردن میان‌افزارهای مورد نیاز
import authUserRoutes from '@/middleware/authUserRoutes';
import optimizeImage from '@/middleware/imageUpload';
import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import mongoose from 'mongoose';

// تابع GET برای دریافت سوالات محصول
export async function GET({ nextUrl: { searchParams } }) {
    await dbConnect(); // اتصال به پایگاه داده
    const question = await ProductsModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(searchParams.get('productID')) } }, // فیلتر کردن محصول بر اساس ID
        { $unwind: '$questions' }, // باز کردن آرایه سوالات
        { $sort: { 'questions.date': -1 } }, // مرتب‌سازی سوالات بر اساس تاریخ
        { $limit: searchParams.get('page') ? 8 : 200 }, // محدود کردن تعداد سوالات
        { $replaceRoot: { newRoot: '$questions' } }, // جایگزینی ریشه با سوالات
        { $project: { userId: 0, answer: 0, username: 0 } } // حذف فیلدهای غیر ضروری
    ]);
    return Response.json(question); // بازگرداندن سوالات به صورت JSON
}

// تابع POST برای ارسال سوال جدید
export async function POST(req) {
    return errorHandling(async()=>{

        await dbConnect(); // اتصال به پایگاه داده
        await authUserRoutes(req); // احراز هویت کاربر

        const {
            nextUrl: { searchParams }
        } = req;

        const _user = JSON.parse(req.headers.get('user')); // دریافت اطلاعات کاربر از هدر
        const formdata = await req.formData(); // دریافت داده‌های فرم
        const { title, message, image } = Object.fromEntries(formdata); // استخراج فیلدهای فرم

        // بررسی اینکه کاربر در دوره شرکت کرده باشد
        if (searchParams.get('productID') !== '667610dcca08b7215a5ba872' && (!_user?.products || !_user.products.find(p=>p.productId === searchParams.get('productID')))?.productId) 
            return Response.json('شما در این دوره شرکت نکردین',{status:403})

        const filename = await optimizeImage(image); // بهینه‌سازی تصویر

        const product = await ProductsModel.findById(searchParams.get('productID')); // یافتن محصول بر اساس ID

        // افزودن سوال جدید به محصول
        product.questions.push({
            username: _user.username,
            email: _user.email,
            title,
            message,
            userId: _user.userId,
            date: new Date(),
            ...(image?.size && { imageUrl: filename }) // افزودن URL تصویر در صورت وجود
        });

        await product.save(); // ذخیره محصول

        return Response.json({ message: 'عملیات موفق آمیز بود', dt: product.questions.pop() }); // بازگرداندن پیام موفقیت
    })
}
