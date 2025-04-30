import authAdminRoutes from '@/middleware/authAdminRoutes';
import { TicketModel } from '@/models/TiketsModel';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { NextRequest, NextResponse as res } from 'next/server';

// Type definitions
interface TicketAnswer {
    _id?: string;
    message: string;
    imageUrl?: string;
}

interface FormData {
    image?: File;
    message: string;
}

// POST endpoint for creating a ticket answer
export async function POST(req: NextRequest, { params }: { params: { id: string[] } }) {
    try {
        await dbConnect();
        await authAdminRoutes();
        
        const formdata = await req.formData();
        const { image, message } = Object.fromEntries(formdata) as unknown as FormData;
        
        let filename: string | undefined;
        
        if (image?.size) {
            const buffer = Buffer.from(await image.arrayBuffer());
            filename = `${Date.now().toString(32)}${Math.floor(Math.random() * 89999 + 10000)}_${image.name}`;
            const uploadPath = path.join(process.cwd(), 'assets/uploads/ticket', filename);
            
            writeFileSync(uploadPath, buffer);
        }

        const ticket = await TicketModel.findById(params.id[0]);
        if (!ticket) {
            return res.json({ message: 'تیکت یافت نشد' }, { status: 404 });
        }

        const newAnswer: TicketAnswer = {
            message,
            ...(filename && { imageUrl: filename })
        };

        ticket.userSeen = false;
        ticket.adminSeen = true;
        ticket.answer?.push(newAnswer);
        
        await ticket.save();

        return res.json({ 
            message: 'پاسخ تیکت با موفقیت ارسال شد', 
            dt: ticket.answer && ticket.answer[ticket.answer?.length - 1] 
        });

    } catch (error: any) {
        console.error('Error creating ticket answer:', error);
        return res.json(
            { message: error?.message || 'خطا در ارسال پاسخ تیکت' },
            { status: error?.status || 500 }
        );
    }
}

// PUT endpoint for updating a ticket answer
export async function PUT(req: NextRequest, { params }: { params: { id: string[] } }) {
    try {
        await dbConnect();
        await authAdminRoutes();
        
        const formdata = await req.formData();
        const { image, message } = Object.fromEntries(formdata) as unknown as FormData;
        
        const ticket = await TicketModel.findById(params.id[0]);
        if (!ticket) {
            return res.json({ message: 'تیکت یافت نشد' }, { status: 404 });
        }

        const answer = ticket.answer?.id(params.id[1]);
        if (!answer) {
            return res.json({ message: 'پاسخ یافت نشد' }, { status: 404 });
        }

        let filename: string | undefined;
        
        if (image?.size) {
            if (answer.imageUrl) {
                const oldImagePath = path.join(process.cwd(), 'assets/uploads/ticket', answer.imageUrl);
                if (existsSync(oldImagePath)) {
                    unlinkSync(oldImagePath);
                }
            }

            const buffer = Buffer.from(await image.arrayBuffer());
            filename = `${Date.now()}_${image.name}`;
            const uploadPath = path.join(process.cwd(), 'assets/uploads/ticket', filename);
            
            writeFileSync(uploadPath, buffer);
        }

        answer.message = message;
        if (filename) answer.imageUrl = filename;
        ticket.userSeen = false;
        
        await ticket.save();

        return res.json({ 
            message: 'پاسخ تیکت با موفقیت به‌روزرسانی شد', 
            dt: answer 
        });

    } catch (error: any) {
        console.error('Error updating ticket answer:', error);
        return res.json(
            { message: error?.message || 'خطا در به‌روزرسانی پاسخ تیکت' },
            { status: error?.status || 500 }
        );
    }
}

// GET endpoint for retrieving a ticket answer
export async function GET(req: NextRequest, { params }: { params: { id: string[] } }) {
    try {
        await dbConnect();
        await authAdminRoutes();
        
        const ticket = await TicketModel.findById(params.id[0]);
        if (!ticket) {
            return res.json({ message: 'تیکت یافت نشد' }, { status: 404 });
        }

        const answer = ticket.answer?.id(params.id[1]);
        if (!answer) {
            return res.json({ message: 'پاسخ یافت نشد' }, { status: 404 });
        }

        return res.json(answer);

    } catch (error: any) {
        return res.json(
            { message: error?.message || 'خطا در دریافت پاسخ تیکت' },
            { status: error?.status || 500 }
        );
    }
}

// DELETE endpoint for removing a ticket answer
export async function DELETE(req: NextRequest, { params }: { params: { id: string[] } }) {
    try {
        await dbConnect();
        await authAdminRoutes();
        
        const ticket = await TicketModel.findById(params.id[0]);
        if (!ticket) {
            return res.json({ message: 'تیکت یافت نشد' }, { status: 404 });
        }

        const answer = ticket.answer?.id(params.id[1]);
        if (!answer) {
            return res.json({ message: 'پاسخ یافت نشد' }, { status: 404 });
        }

        if (answer.imageUrl) {
            const imagePath = path.join(process.cwd(), 'assets/uploads/ticket', answer.imageUrl);
            if (existsSync(imagePath)) {
                unlinkSync(imagePath);
            }
        }

        ticket.answer?.pull(answer);
        await ticket.save();

        return res.json({ 
            message: 'پاسخ تیکت با موفقیت حذف شد', 
            dt: answer 
        });

    } catch (error: any) {
        return res.json(
            { message: error?.message || 'خطا در حذف پاسخ تیکت' },
            { status: error?.status || 500 }
        );
    }
}