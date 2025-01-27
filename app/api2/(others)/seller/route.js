import authSeller from '@/middleware/authSeller';
import { PaymentsModel } from '@/models/PaymentsModel';
import dbConnect from '@/utils/dbConnect';

export async function GET(req) {
    try {
        // برقراری ارتباط با دیتابیس
        await dbConnect();
        // چک کردن لاگین بودن فروشنده
        await authSeller(req);
        // دریافت اطلاعات فروشنده از هدر
        const _user = JSON.parse(req.headers.get('user'));

        // دریافت لیست پرداخت های موفق انجام شده توسط فروشنده
        const payments = await PaymentsModel.find({
            // پرداخت های موفق
            success: true,
            // پرداخت هایی که توسط این فروشنده انجام شده
            representative: _user.userId,
            // پرداخت هایی که در 35 روز گذشته انجام شده
            date: { $gte: new Date(new Date().getTime() - 60000 * 60 * 24 * 35) }
        })
            .select('title price date')
            .sort({ date: -1 });

        // بر گرداندن لیست پرداخت ها
        return Response.json({ payments });
    } catch (error) {
        // بر گرداندن خطای رخ داده
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
