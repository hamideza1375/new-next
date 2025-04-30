import { TicketModel } from '@/models/Tikets';
import dbConnect from '@/utils/dbConnect';

export async function GET(req) {
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));

    let countSeen = await TicketModel.find({ user: _user.userId, userSeen: 0 }).countDocuments();
    return Response.json(countSeen);
}

export async function POST(req) {
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));

    const ticket = await TicketModel.findOne({ _id: req.nextUrl.searchParams.get('tiketID'), user:_user.userId });
   if(ticket) ticket.userSeen = 1
    await ticket.save();
    return Response.json('',{status:202});
}
