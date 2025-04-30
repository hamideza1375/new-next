import { TicketModel } from '@/models/Tikets';

export async function GET({ nextUrl: { searchParams }, headers }) {
    const _user = JSON.parse(headers.get('user'));
    const getAnswersTicket = await TicketModel.findById(searchParams.get('ticketID')).select({
        userSeen: 0,
        adminSeen: 0
    });

    let answer = getAnswersTicket.answer.reverse();

    let ticketObject = getAnswersTicket.toObject();

    delete ticketObject.answer;

    return Response.json([...answer, ticketObject]);
}