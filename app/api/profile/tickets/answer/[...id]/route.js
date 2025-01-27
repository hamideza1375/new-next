import optimizeImage from '@/middleware/imageUpload';
import errorHandling from '@/middleware/errorHandling';
import { TicketModel } from '@/models/Tikets';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync } from 'fs';
import path from 'path';

export async function POST(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));
    const formdata = await req.formData();
    const { image, message } = Object.fromEntries(formdata);
 
    const filename = await optimizeImage(image);

    const ticket = await TicketModel.findById(params.id[0]);
    ticket.userSeen = 1;
    ticket.adminSeen = 0;
    ticket.date = new Date();

    ticket.answer.push({
        message: message,
        userId: _user.userId,
        date: new Date(),
        ...(image && { imageUrl: filename })
    });
    await ticket.save();

    return Response.json({ message: 'تیکت شما با موفقیت ارسال شد', dt: ticket.answer[ticket.answer.length - 1] });
    })
}

export async function PUT(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));
    const formdata = await req.formData();
    const { image, message } = Object.fromEntries(formdata);

    const ticket = await TicketModel.findById(params.id[0]);
    const answer = ticket.answer.id(params.id[1]);

    if(_user.userId !== String(ticket.userId)) return Response.json('شما اجازه ی این کار را ندارید',{status:400})

    if (image?.size) {
        if (answer?.imageUrl) {
            if (existsSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl));
        }
    }

    const filename = await optimizeImage(image);

    answer.message = message;
    if (image?.size) answer.imageUrl = filename;
    ticket.date = new Date();
    ticket.adminSeen = 0;

    await ticket.save();
    return Response.json({ message: 'تیکت شما با موفقیت ارسال شد', dt: answer });
    })
}

export async function GET(req, { params }) {
    await dbConnect();
    const ticket = await TicketModel.findById(params.id[0]);

    const answer = ticket.answer.id(params.id[1]);

    return Response.json(answer);
}

export async function DELETE(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();
    
    const _user = JSON.parse(req.headers.get('user'));

    const ticket = await TicketModel.findById(params.id[0]);
    const answer = ticket.answer.id(params.id[1]);

    if(_user.userId !== String(ticket.userId)) return Response.json('شما اجازه ی این کار را ندارید',{status:400})

    if (answer?.imageUrl)
        if (existsSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl)))
            unlinkSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl));

    ticket.answer.pull(answer);
    await ticket.save();

    return Response.json({ message: 'با موفقیت حذف شد', dt: answer });
})
}
