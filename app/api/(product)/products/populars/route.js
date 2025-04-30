// وارد کردن مدل محصولات و تابع اتصال به دیتابیس
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت محصولات محبوب
export async function GET() {
    // اتصال به دیتابیس
    await dbConnect();
    
    // جستجوی محصولات محبوب
    let populars = await ProductsModel.find({ popular: { $eq: true } });
    
    // بازگشت پاسخ شامل محصولات محبوب
    return Response.json(populars);
}
