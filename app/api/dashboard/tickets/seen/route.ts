import authAdminRoutes from '@/middleware/authAdminRoutes';
import { TicketModel } from '@/models/TiketsModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

// تعریف نوع داده‌ای برای تیکت‌ها
type TicketData = {
    _id: string;
    title: string;
    message: string;
    adminSeen: boolean;
    date: Date;
};

// تابع GET برای دریافت تعداد تیکت‌های دیده نشده توسط ادمین
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        // شمارش تعداد تیکت‌های دیده نشده
        const countSeen: number = await TicketModel.find({ adminSeen: false }).countDocuments();

        return NextResponse.json(countSeen);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: error?.status || 500 });
    }
}

// تابع POST برای به‌روزرسانی وضعیت دیده شدن تیکت توسط ادمین
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        const tiketID = req.nextUrl.searchParams.get('tiketID');
        if (!tiketID) {
            return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
        }

        const ticket = await TicketModel.findOne({ _id: tiketID });
        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // به‌روزرسانی وضعیت دیده شدن تیکت
        ticket.adminSeen = true;
        await ticket.save();

        return NextResponse.json({ message: 'Ticket updated successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: error?.status || 500 });
    }
}
