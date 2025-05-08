import authAdminRoutes from '@/middleware/authAdminRoutes';
import { TicketModel } from '@/models/TiketsModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse } from 'next/server';



// جعبه پاسخ
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        // استخراج پارامترهای جستجو از URL درخواست
        const ticketID = req.nextUrl.searchParams.get('ticketID');
        if (!ticketID) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        await authAdminRoutes();
        await dbConnect();

        // یافتن تیکت با استفاده از ID و انتخاب فیلدهای مورد نظر
        const getAnswersTicket = await TicketModel.findById(ticketID)
            .select({ userSeen: 0, adminSeen: 0 })
            .populate('userId', '-_id username email');

        if (!getAnswersTicket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // معکوس کردن ترتیب پاسخ‌ها
        const answer = getAnswersTicket.answer?.reverse();

        // تبدیل تیکت به شیء
        const ticketObject = getAnswersTicket.toObject() as any;

        // حذف فیلد پاسخ از شیء تیکت
        delete ticketObject.answer;


        // ticketObject.set('answer', []);
        // await ticketObject.save();



        // بازگرداندن پاسخ‌ها به همراه شیء تیکت
        return NextResponse.json([...(answer || []), ticketObject]);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error?.message }, { status: error?.status || 500 });
    }
}
