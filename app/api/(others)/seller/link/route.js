import authSeller from '@/middleware/authSeller';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

// این تابع برای دریافت لیست محصولات با قیمت و نسخه ی غیر صفر است
export async function GET(req) {
    try {
        // اتصال به دیتابیس
        await dbConnect();
        // چک لاگین بودن فروشنده
        await authSeller(req);
        // دریافت اطلاعات فروشنده از هدر
        const _user = JSON.parse(req.headers.get('user'));

        // دریافت لیست محصولات با قیمت و نسخه ی غیر صفر
        const products = await ProductsModel.find({price:{$ne: 0}, version:{$ne: 0}}).select('title');

        // دریافت پروتکل و هاست از هدر
        const protocol = req.headers.get('x-forwarded-proto');
        const host = req.headers.get('host');

        // ساخت آدرس های محصولات
        const urls = products.map((item)=>({title: item.title,product:`${protocol}://${host}/product/${item._id}?representative=${_user.userId}`,url:`${protocol}://${host}/api/payment/confirm/${item._id}?representative=${_user.userId}`}))

        // برگرداندن لیست محصولات
        return Response.json(urls);
    } catch (error) {
        // برگرداندن خطا
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

