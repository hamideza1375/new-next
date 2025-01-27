// وارد کردن مدل محصولات و تابع اتصال به دیتابیس
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت اطلاعات محصول
export async function GET({ nextUrl: { searchParams } }) {
    // اتصال به دیتابیس
    await dbConnect();
    
    // بررسی وجود productID و جستجوی محصول بر اساس آن
    const product = searchParams.get('productID')
        ? await ProductsModel.findById(searchParams.get('productID'))
              .select('title videoUrl times progress parts._id parts.title parts.videoUrl parts.sourceUrl parts.chapter')
        // در غیر این صورت، جستجوی محصول بر اساس partID
        : await ProductsModel.findOne({ 'parts._id': searchParams.get('partID') })
              .select('title videoUrl times progress parts._id parts.title parts.videoUrl parts.sourceUrl parts.chapter')

    // اگر محصول پیدا نشد، بازگشت پاسخ با وضعیت 404
    if(!product) return Response.json('دوره ی مورد نظر پیدا نشد',{status:404})

    // مرتب سازی بخش‌های محصول بر اساس شماره فصل
    const parts = product.parts.sort((a, b) => a.chapter - b.chapter)

    // تبدیل محصول به شیء ساده جاوااسکریپت
    let _product = product.toObject();

    // حذف بخش‌های محصول از شیء
    delete _product.parts;

    // بازگشت پاسخ شامل اطلاعات محصول و بخش‌های آن
    return Response.json([_product, ...parts]);
}
