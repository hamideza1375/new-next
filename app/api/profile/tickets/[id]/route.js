import errorHandling from '@/middleware/errorHandling';
import optimizeImage from '@/middleware/imageUpload';
import { TicketModel } from '@/models/Tikets';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync } from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));

    const tickets = await TicketModel.findOne({ _id: params.id, userId: _user.userId }).select(
        'imageUrl title message userSeen date'
    );

    return Response.json(tickets || {});
}

export async function DELETE(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();

    const ticket = await TicketModel.findByIdAndDelete(params.id);

    const _user = JSON.parse(req.headers.get('user'));
    if (_user.userId !== String(ticket.userId))
        return Response.json('شما اجازه ی این کار را ندارید', { status: 400 });

    if (ticket?.imageUrl)
        if (existsSync(path.join(process.cwd(), 'assets/uploads/ticket/' + ticket.imageUrl)))
            unlinkSync(path.join(process.cwd(), 'assets/uploads/ticket/' + ticket.imageUrl));

    ticket.answer.forEach(item => {
        if (item?.imageUrl)
            if (existsSync(path.join(process.cwd(), 'assets/uploads/ticket/' + item.imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/ticket/' + item.imageUrl));
    });

    if (ticket) return Response.json({ message: 'با موفقیت حذف شد' });
    else return Response.json({ message: 'تیکتی با این شناسه یافت نشد' }, { status: 404 });
    })
}

export async function PUT(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));
    const formdata = await req.formData();
    const { image, title, message } = Object.fromEntries(formdata);

    const ticket = await TicketModel.findById(params.id).select({ answer: 0 });

    if (_user.userId !== String(ticket.userId))
        return Response.json('شما اجازه ی این کار را ندارید', { status: 400 });

    if (image?.size && ticket?.imageUrl)
        if (existsSync(path.join(process.cwd(), 'assets/uploads/ticket/' + ticket.imageUrl)))
            unlinkSync(path.join(process.cwd(), 'assets/uploads/ticket/' + ticket.imageUrl));

    const filename = await optimizeImage(image);

    ticket.title = title;
    ticket.message = message;
    if (image?.size) ticket.imageUrl = filename;

    await ticket.save();

    return Response.json({ message: 'با موفقیت ویرایش شد' });
})
}
