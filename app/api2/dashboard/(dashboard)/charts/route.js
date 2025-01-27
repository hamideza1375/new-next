import authAdminRoutes from '@/middleware/authAdminRoutes';
import errorHandling from '@/middleware/errorHandling';
import { PaymentsModel } from "@/models/PaymentsModel";
import { SignModel } from "@/models/SignModel";

/** @param {import('next/server').NextRequest} req */

export async function GET(req) {
    errorHandling(req, async () => {
        // برسی احراز هویت ادمین
        await authAdminRoutes(req);
        // جستجوی پرداخت‌های موفق در دیتابیس در ۳۰ روز گذشته
        const chart = await PaymentsModel.find({
            success: true,
            date: { $gt: new Date(new Date().getTime() - 60000 * 60 * 24 * (30)) }
        })
        .select('-_id date price')
        // .sort({date:-1})

        // شمارش تعداد کاربران
        const usersLength = await SignModel.find().countDocuments();
        // بازگشت پاسخ به صورت JSON
        return Response.json({ chart, usersLength });
    })
}



// import authAdminRoutes from '@/middleware/authAdminRoutes';
// import dbConnect from '@/utils/dbConnect';
// import { NextRequest } from 'next/server';

// const { PaymentsModel } = require('@/models/PaymentsModel');
// const { SignModel } = require('@/models/SignModel');

// /** @param {NextRequest} req * @param {() => void} */

// export async function GET(req) {
//     const { nextUrl: { searchParams } } = req
//     try {
//         await dbConnect();
//         await authAdminRoutes(req);
//         let chart, usersLength;

//         const type = searchParams.get('type');

//         switch (type) {
//             case 'payments7day':
//                 chart = await PaymentsModel.find({
//                     success: true,
//                     date: { $gt: new Date(new Date().getTime() - 60000 * 60 * 24 * (7 + 1)) }
//                 });
//                 break;
//             case 'payments1year':
//                 chart = await PaymentsModel.find({
//                     success: true,
//                     date: { $gt: new Date(new Date().getTime() - 60000 * 60 * 24 * (365 + 30)) }
//                 });
//                 break;
//             case 'user7day':
//                 chart = await SignModel.find({
//                     date: { $gt: new Date(new Date().getTime() - 60000 * 60 * 24 * (7 + 1)) }
//                 }).select({ date: 1 });
//                 usersLength = await SignModel.find().countDocuments();
//                 break;
//             default:
//                 return Response.json('تایپ را صحیح وارد کنید', { status: 404 });
//         }

//         return Response.json({ chart, usersLength });
//     } catch (error) {
//         return Response.json(error?.message, { status: (error && error.status) || 500 });
//     }
// }
