import errorHandling from '@/middleware/errorHandling';
import imageUpload from '@/middleware/imageUpload';
import { ITicket, TicketModel } from '@/models/TiketsModel';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';
import { existsSync, unlinkSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';


export async function POST(req: NextRequest, { params }: { params: { id: string[] } }) {
  return errorHandling(async () => {
    await dbConnect();

    const _user = getUser(req)
    
    const formdata = await req.formData();
    const { image, message } = Object.fromEntries(formdata) as { image: File | null; message: string };

    if (!params.id?.[0]) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const filename = image ? await imageUpload(image) : null;

    const ticket = await TicketModel.findById(params.id[0]) as unknown as ITicket;
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    ticket.userSeen = true;
    ticket.adminSeen = false;

    const newAnswer = {
      message: message,
      userId: _user.userId,
      ...(image && filename && { imageUrl: filename })
    };

    ticket.answer.push(newAnswer);
    await ticket.save();

    return NextResponse.json({ 
      message: 'تیکت شما با موفقیت ارسال شد', 
      dt: ticket.answer[ticket.answer.length - 1] 
    });
  });
}


export async function PUT(req: NextRequest, { params }: { params: { id: string[] } }) {
  return errorHandling(async () => {
    await dbConnect();

    const _user = getUser(req)
    
    const formdata = await req.formData();
    const { image, message } = Object.fromEntries(formdata) as { image: File | null; message: string };

    if (!params.id?.[0] || !params.id?.[1]) {
      return NextResponse.json({ error: 'Ticket ID and Answer ID are required' }, { status: 400 });
    }

    const ticket = await TicketModel.findById(params.id[0]) as unknown as ITicket;
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const answer = ticket.answer.id(params.id[1]);
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    if (_user.userId !== String(ticket.user)) {
      return NextResponse.json({ error: 'شما اجازه ی این کار را ندارید' }, { status: 400 });
    }

    if (image?.size) {
      if (answer?.imageUrl) {
        const imagePath = path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl);
        if (existsSync(imagePath)) {
          unlinkSync(imagePath);
        }
      }
    }

    const filename = image?.size ? await imageUpload(image) : null;

    answer.message = message;
    if (filename) answer.imageUrl = filename;
    ticket.adminSeen = false;

    await ticket.save();
    return NextResponse.json({ 
      message: 'تیکت شما با موفقیت ارسال شد', 
      dt: answer 
    });
  });
}


export async function GET(req: NextRequest, { params }: { params: { id: string[] } }) {
  try {
    await dbConnect();
    
    if (!params.id?.[0] || !params.id?.[1]) {
      return NextResponse.json({ error: 'Ticket ID and Answer ID are required' }, { status: 400 });
    }

    const ticket = await TicketModel.findById(params.id[0]) as unknown as ITicket;
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const answer = ticket.answer.id(params.id[1]);
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string[] } }) {
  return errorHandling(async () => {
    await dbConnect();
 
    const _user = getUser(req)

    if (!params.id?.[0] || !params.id?.[1]) {
      return NextResponse.json({ error: 'Ticket ID and Answer ID are required' }, { status: 400 });
    }

    const ticket = await TicketModel.findById(params.id[0]) as unknown as ITicket;
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const answer = ticket.answer.id(params.id[1]);
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    if (_user.userId !== String(ticket.user)) {
      return NextResponse.json({ error: 'شما اجازه ی این کار را ندارید' }, { status: 400 });
    }

    if (answer?.imageUrl) {
      const imagePath = path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl);
      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
      }
    }

    ticket.answer.pull(answer);
    await ticket.save();

    return NextResponse.json({ 
      message: 'با موفقیت حذف شد', 
      dt: answer 
    });
  });
}