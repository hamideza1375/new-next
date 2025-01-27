// وارد کردن میان‌افزار authAdminRoutes
import authAdminRoutes from '@/middleware/authAdminRoutes';
// وارد کردن مدل PaymentsModel
import { PaymentsModel } from '@/models/PaymentsModel';
// وارد کردن تابع اتصال به پایگاه داده
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت پرداخت‌ها
export async function GET(req) {
    try {
        // دریافت شماره صفحه از پارامترهای جستجو
        const pageNumber = Number(req.nextUrl.searchParams.get('page'));
        // دریافت تعداد آیتم‌ها در هر صفحه از پارامترهای جستجو
        const pageSize = Number(req.nextUrl.searchParams.get('limit'));
        // محاسبه تعداد آیتم‌هایی که باید رد شوند
        const skipItems = (pageNumber - 1) * pageSize;

        // اتصال به پایگاه داده
        await dbConnect();
        // اجرای میان‌افزار authAdminRoutes
        await authAdminRoutes(req);
        // یافتن پرداخت‌ها با استفاده از مدل PaymentsModel
        const payments = await PaymentsModel.find()
            // پر کردن فیلد userId با اطلاعات کاربر
            .populate('userId', 'username email')
            // مرتب‌سازی پرداخت‌ها بر اساس تاریخ به صورت نزولی
            .sort({ date: -1 })
            // رد کردن آیتم‌های محاسبه شده
            .skip(skipItems)
            // محدود کردن تعداد آیتم‌ها به اندازه صفحه
            .limit(pageSize)
        // بازگرداندن پرداخت‌ها به صورت JSON
        return Response.json(payments);
    } catch (error) {
        // بازگرداندن پیام خطا به صورت JSON
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}

// کد کامنت شده برای دریافت آخرین پرداخت‌ها
// this.getLastPayment = async (req, res) => {
//     const pageNumber = req.query.page || 1;
//     const pageSize = 3;
//     const skipItems = (pageNumber - 1) * pageSize;
//     const totalItems = await PaymentModel.find({ success: true, userId: req.userId }).countDocuments();

//     const lastPayment = await PaymentModel.find({ success: true, userId: req.userId })
//       .sort({ date: -1 })
//       .skip(skipItems)
//       .limit(pageSize)
//     res.json({ value: lastPayment });
//   };
