/**
 * این تابع برای دریافت لیست آخرین پرداخت های کاربر است
 * ابتدا دیتابیس را کانکت می کند
 * سپس با استفاده از میانی افزار authUserRoutes چک می کند که آیا کاربر لاگین کرده است یا خیر
 * اگر لاگین کرده بود، اطلاعات کاربر را از هدر می گیرد
 * سپس با استفاده از مدل PaymentsModel لیست آخرین پرداخت های کاربر را دریافت می کند
 * و آن را به صورت آرایه ای از آبجکت ها بر می گرداند
 */
import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import { PaymentsModel } from '@/models/PaymentsModel';

export async function GET(req) {
    errorHandling(async()=>{
        // چک می کنیم که آیا کاربر لاگین کرده است یا خیر
        await authUserRoutes(req);
        // اطلاعات کاربر را از هدر می گیریم
        const _user = JSON.parse(req.headers.get('user'));

        // لیست آخرین پرداخت های کاربر را دریافت می کنیم
        const lastPayment = await PaymentsModel.find({ success: true, userId: _user.userId }).sort({ date: -1 });

        // لیست را به صورت جیسون بر می گردانیم
        return Response.json(lastPayment);
})

}
