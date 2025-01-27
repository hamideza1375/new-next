import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import optimizeImage from '@/middleware/imageUpload';
import { TicketModel } from '@/models/Tikets';
import dbConnect from '@/utils/dbConnect';

export async function POST(req) {
    return errorHandling(async()=>{
        await dbConnect();
        const _user = JSON.parse(req.headers.get('user'));
        const formdata = await req.formData();
        const { image, title, message } = Object.fromEntries(formdata);

        const filename = await optimizeImage(image);

        const newTicket = await TicketModel.create({
            date: new Date(),
            title: title,
            message: message,
            userId: _user.userId,
            ...(image && { imageUrl: filename })
        });
        return Response.json({ message: 'تیکت شما با موفقیت ارسال شد', dt: newTicket });
    })
}

export async function GET(req) {
    try {
    await dbConnect();
    await authUserRoutes(req);
    const _user = JSON.parse(req.headers.get('user'));

    const tickets = await TicketModel.find({ userId: _user.userId }).sort({ date: -1 }).select('title userSeen message date');

    return Response.json(tickets);
} catch (error) {
    return Response.json(error?.message, { status: (error && error.status) || 500 });
}
}
