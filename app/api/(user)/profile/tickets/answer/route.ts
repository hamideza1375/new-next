import { ITicket, TicketModel } from '@/models/TiketsModel';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const getAnswersTicket = await TicketModel.findById(req.nextUrl.searchParams.get('ticketID')).select({
        userSeen: 0,
        adminSeen: 0
    }) as unknown as ITicket ;

    let answer = getAnswersTicket.answer.reverse() || [];

    let ticketObject = getAnswersTicket.toObject();

    ticketObject.answer = undefined

    return Response.json([...answer, ticketObject]);
}
