// وارد کردن مدل محصولات و تابع اتصال به دیتابیس
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت محصولات
export async function GET({ nextUrl: { searchParams } }) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        let products;
        // بررسی وجود پارامتر categoryId در درخواست
        if (searchParams.get('categoryId'))
            // جستجوی محصولات بر اساس categoryId و انتخاب فیلدهای مشخص
            products = await ProductsModel.find({ categoryId: searchParams.get('categoryId') }).select({comments:0, parts:0, questions:0, stars:0,videoUrl:0, progress:0})
        // .sort({createAt: -1});
        else 
            // جستجوی همه محصولات و مرتب‌سازی بر اساس تاریخ
            products = await ProductsModel.find().sort({ data: -1 }).select({comments:0, parts:0, questions:0, stars:0,videoUrl:0, progress:0})
        // .sort({createAt: -1})
        
        // بازگشت پاسخ به صورت JSON
        return Response.json(products);
    } catch (err) {
        // ثبت خطا در کنسول
        console.log(err);
        // بازگشت پاسخ خطا به صورت JSON
        return Response.json({}, { status: 500 });
    }
}
