// وارد کردن مدل محصولات و ابزار اتصال به پایگاه داده
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

// تابع POST برای جستجوی محصولات
export async function POST(req) {
    await dbConnect(); // اتصال به پایگاه داده
    let { text } = await req.json(), // دریافت متن جستجو از درخواست
        keywords = text.split(' ').map(keyword => ({ title: { $regex: keyword, $options: 'i' } })), // تبدیل متن به کلمات کلیدی
        allChild=[];

    // جستجوی محصولات بر اساس کلمات کلیدی
    if (text) allChild = await ProductsModel.find({ $or: keywords }).select({ imageUrl1: 1, title: 1 });
    return Response.json(allChild); // بازگرداندن نتایج جستجو به صورت JSON
}
