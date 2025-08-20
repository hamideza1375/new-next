import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import imageUpload from '@/middleware/imageUpload';
import { TicketModel } from '@/models/TiketsModel';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';
import { NextRequest } from 'next/server';

interface NewType {
    image: File;
    title: string;
    message: string;
}

export async function POST(req: NextRequest) {
    return errorHandling(async () => {
        await dbConnect();
        const uHeader = req.headers.get('user');
        const _user = uHeader && JSON.parse(uHeader);
        const formdata = await req.formData();
        const { image, title, message } = Object.fromEntries(formdata) as unknown as NewType;

        const filename = await imageUpload(image);

        const newTicket = await TicketModel.create({
            title: title,
            message: message,
            user: _user.userId,
            ...(image && { imageUrl: filename })
        });
        return Response.json({ message: 'تیکت شما با موفقیت ارسال شد', dt: newTicket });
    });
}


export async function GET(req: NextRequest) {
    return errorHandling(async () => {
        await dbConnect();
        await authUserRoutes();
        const _user = getUser(req);

        const tickets = await TicketModel.find({ user: _user.userId })
            .sort({ createdAt: -1 })
            .select('title userSeen message createdAt');

        return Response.json(tickets);
    });
}
