import { NextRequest, NextResponse } from 'next/server';
import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import errorHandling from '@/middleware/errorHandling';
import optimizeImage from '@/middleware/imageUpload';
import { ITicket, TicketModel } from '@/models/TiketsModel';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';

type putFormData = {
    image: File | null;
    title: string;
    message: string;
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const _user = getUser(req)

    if (!params.id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const ticket = await TicketModel.findOne({ 
      _id: params.id, 
      user: _user.userId 
    }).select('imageUrl title message userSeen date');

    return NextResponse.json(ticket || {});
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return errorHandling(async () => {
    await dbConnect();
    
    const _user = getUser(req)
    
    if (!params.id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const ticket = await TicketModel.findByIdAndDelete(params.id) as unknown as ITicket;
    
    if (!ticket) {
      return NextResponse.json({ message: 'تیکتی با این شناسه یافت نشد' }, { status: 404 });
    }

    if (_user.userId !== String(ticket.user)) {
      return NextResponse.json({ error: 'شما اجازه ی این کار را ندارید' }, { status: 400 });
    }

    // Delete main ticket image
    if (ticket?.imageUrl) {
      const imagePath = path.join(process.cwd(), 'assets/uploads/ticket/' + ticket.imageUrl);
      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
      }
    }

    // Delete answer images
    if (ticket.answer) {
      ticket.answer.forEach(item => {
        if (item?.imageUrl) {
          const answerImagePath = path.join(process.cwd(), 'assets/uploads/ticket/' + item.imageUrl);
          if (existsSync(answerImagePath)) {
            unlinkSync(answerImagePath);
          }
        }
      });
    }

    return NextResponse.json({ message: 'با موفقیت حذف شد' });
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return errorHandling(async () => {
    await dbConnect();
    
    const _user = getUser(req)
    
    const formdata = await req.formData();


    const { image, title, message } = Object.fromEntries(formdata) as putFormData;

    if (!params.id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const ticket = await TicketModel.findById(params.id).select({ answer: 0 }) as unknown as ITicket;
    
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (_user.userId !== String(ticket.user)) {
      return NextResponse.json({ error: 'شما اجازه ی این کار را ندارید' }, { status: 400 });
    }

    // Handle image update
    if (image?.size && ticket?.imageUrl) {
      const oldImagePath = path.join(process.cwd(), 'assets/uploads/ticket/' + ticket.imageUrl);
      if (existsSync(oldImagePath)) {
        unlinkSync(oldImagePath);
      }
    }

    const filename = image?.size ? await optimizeImage(image) : undefined;

    // Update ticket fields
    ticket.title = title;
    ticket.message = message;
    if (filename) ticket.imageUrl = filename;

    await ticket.save();

    return NextResponse.json({ message: 'با موفقیت ویرایش شد' });
  });
}