import { TicketModel } from '@/models/TiketsModel';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    await dbConnect();
    const _user = getUser(req);

    let countSeen = await TicketModel.find({ user: _user.userId, userSeen: 0 }).countDocuments();
    return Response.json(countSeen);
}

export async function POST(req: NextRequest) {
    await dbConnect();
    const _user = getUser(req);

    const ticket = await TicketModel.findOne({
        _id: req.nextUrl.searchParams.get('tiketID'),
        user: _user.userId
    });
    if (ticket) {
        ticket.userSeen = true;
        await ticket.save();
    }
    return Response.json('', { status: 202 });
}
