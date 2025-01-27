import errorHandling from '@/middleware/errorHandling'; // وارد کردن میانی افزار برای مدیریت خطا
import authUserRoutes from '@/middleware/authUserRoutes'; // وارد کردن میانی افزار برای بررسی احراز هویت کاربر
import { ProductsModel } from '@/models/ProductModel'; // وارد کردن مدل محصولات
import dbConnect from '@/utils/dbConnect'; // وارد کردن تابع اتصال به دیتابیس

export async function GET({ nextUrl: { searchParams } }) { // تابع GET برای دریافت کامنت‌ها
    try {
        await dbConnect(); // اتصال به دیتابیس
        const product = await ProductsModel.findOne({ _id: searchParams.get('productID') }) // جستجوی محصول بر اساس آیدی
            .slice('comments', -100) // دریافت آخرین 100 کامنت
            .populate('comments.userId', '-_id email') // پر کردن اطلاعات کاربر برای هر کامنت بدون نمایش آیدی
            .lean() // تبدیل نتیجه به یک آبجکت ساده
            .then(product => product?.comments.reverse() || []); // معکوس کردن ترتیب کامنت‌ها در صورت وجود

        return Response.json(product); // بازگرداندن کامنت‌ها به صورت JSON
    } catch (error) {
        console.log(error); // نمایش خطا در کنسول
        return Response.json([]); // بازگرداندن آرایه خالی در صورت بروز خطا
    }
}
export async function POST(req) { // تابع POST برای ارسال کامنت جدید
    return errorHandling(async()=>{ // مدیریت خطاها با استفاده از تابع errorHandling
        await dbConnect(); // اتصال به دیتابیس
        await authUserRoutes(req); // بررسی احراز هویت کاربر

        const {
            nextUrl: { searchParams }
        } = req; // استخراج پارامترهای جستجو از URL

        const _user = JSON.parse(req.headers.get('user')); // استخراج اطلاعات کاربر از هدر درخواست

        const { message, star } = await req.json(); // استخراج اطلاعات کامنت و ستاره از بدنه درخواست

        const product = await ProductsModel.findById(searchParams.get('productID')); // جستجوی محصول بر اساس آیدی

        product.comments.push({
            message,
            star,
            username: _user.username,
            userId: _user.userId,
            email: _user.email
        }); // افزودن کامنت جدید به لیست کامنت‌های محصول

        product.stars = (product.stars || 0) + Number(star); // به‌روزرسانی تعداد کل ستاره‌ها
        product.meanStar = (product.stars || 0) / product.comments.length; // محاسبه میانگین ستاره‌ها

        await product.save(); // ذخیره تغییرات در دیتابیس

        return Response.json({
            message: 'کامنت شما ارسال شد و بعد از تایید مدیر در سایت قرار میگیرد' /* dt: product.comments.pop() */
        }); // بازگرداندن پیام موفقیت به صورت JSON
    })
}

