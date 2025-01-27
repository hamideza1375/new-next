import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import { CertificateModel } from '@/models/CertificateModel';
import dbConnect from '@/utils/dbConnect';

/**
 * دریافت همه گواهی نامه های یک کاربر
 * 
 * @param {NextRequest} req 
 * @returns {Response} 
 */
export async function GET(req) {
    return errorHandling(async()=>{
        // چک کردن لاگین کاربر
        await authUserRoutes(req);

        // دریافت اطلاعات کاربر
        const _user = JSON.parse(req.headers.get('user'));

        // دریافت همه گواهی نامه های کاربر
        const certificates = await CertificateModel.find({success:true, userId: _user.userId }).sort({ date: -1 });

        // ارسال پاسخ
        return Response.json(certificates);
    })
}


