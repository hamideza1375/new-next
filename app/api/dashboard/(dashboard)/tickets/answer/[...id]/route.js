// وارد کردن ماژول‌های مورد نیاز
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { TicketModel } from '@/models/Tikets';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';

// متد POST برای ارسال پاسخ به تیکت
export async function POST(req, { params }) {
    try {
        await dbConnect(); // اتصال به دیتابیس
        await authAdminRoutes(req); // احراز هویت ادمین
        const formdata = await req.formData(); // دریافت داده‌های فرم
        const { image, message } = Object.fromEntries(formdata); // استخراج تصویر و پیام از داده‌های فرم
        let buffer, filename;

        if (image?.size) { // اگر تصویر وجود داشت
            buffer = Buffer.from(await image.arrayBuffer()); // تبدیل تصویر به بافر
            filename = Date.now().toString('32') + '' + Math.floor(Math.random() * 99999 + 10000) + '_' + image.name; // تولید نام فایل
            writeFileSync(path.join(process.cwd(), 'assets/uploads/ticket/' + filename), buffer); // ذخیره تصویر در مسیر مشخص
        }

        const ticket = await TicketModel.findById(params.id[0]); // پیدا کردن تیکت با استفاده از آیدی
        ticket.userSeen = 0; // تنظیم وضعیت دیده شدن توسط کاربر
        ticket.adminSeen = 1; // تنظیم وضعیت دیده شدن توسط ادمین
        ticket.date = new Date(); // تنظیم تاریخ

        ticket.answer.push({
            message: message,
            date: new Date(),
            ...(image?.size && { imageUrl: filename }) // اضافه کردن تصویر به پاسخ در صورت وجود
        });
        await ticket.save(); // ذخیره تیکت

        return Response.json({ message: 'تیکت شما با موفقیت ارسال شد', dt: ticket.answer[ticket.answer.length - 1] }); // ارسال پاسخ موفقیت
    } catch (error) {
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 }); // ارسال پاسخ خطا
    }
}

// متد PUT برای ویرایش پاسخ تیکت
export async function PUT(req, { params }) {
    try {
        await dbConnect(); // اتصال به دیتابیس
        await authAdminRoutes(req); // احراز هویت ادمین
        const formdata = await req.formData(); // دریافت داده‌های فرم
        const { image, message } = Object.fromEntries(formdata); // استخراج تصویر و پیام از داده‌های فرم
        let buffer, filename;

        const ticket = await TicketModel.findById(params.id[0]); // پیدا کردن تیکت با استفاده از آیدی
        const answer = ticket.answer.id(params.id[1]); // پیدا کردن پاسخ با استفاده از آیدی

        if (image?.size) { // اگر تصویر وجود داشت
            if (answer?.imageUrl) { // اگر پاسخ قبلی تصویر داشت
                if (existsSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl)))
                    unlinkSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl)); // حذف تصویر قبلی
            }

            buffer = Buffer.from(await image.arrayBuffer()); // تبدیل تصویر به بافر
            filename = Date.now() + '_' + image.name; // تولید نام فایل
            writeFileSync(path.join(process.cwd(), 'assets/uploads/ticket/' + filename), buffer); // ذخیره تصویر در مسیر مشخص
        }

        answer.message = message; // به‌روزرسانی پیام پاسخ
        if (image?.size) answer.imageUrl = filename; // به‌روزرسانی تصویر پاسخ در صورت وجود
        ticket.date = new Date(); // تنظیم تاریخ
        ticket.userSeen = 0; // تنظیم وضعیت دیده شدن توسط کاربر

        await ticket.save(); // ذخیره تیکت
        return Response.json({ message: 'تیکت شما با موفقیت ارسال شد', dt: answer }); // ارسال پاسخ موفقیت
    } catch (error) {
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 }); // ارسال پاسخ خطا
    }
}

// متد GET برای دریافت پاسخ تیکت
export async function GET(req, { params }) {
    try {
        await dbConnect(); // اتصال به دیتابیس
        await authAdminRoutes(req); // احراز هویت ادمین
        const ticket = await TicketModel.findById(params.id[0]); // پیدا کردن تیکت با استفاده از آیدی

        const answer = ticket.answer.id(params.id[1]); // پیدا کردن پاسخ با استفاده از آیدی

        return Response.json(answer); // ارسال پاسخ
    } catch (error) {
        return Response.json(error?.message, { status: (error && error.status) || 500 }); // ارسال پاسخ خطا
    }
}

// متد DELETE برای حذف پاسخ تیکت
export async function DELETE(req, { params }) {
    try {
        await dbConnect(); // اتصال به دیتابیس
        await authAdminRoutes(req); // احراز هویت ادمین

        const ticket = await TicketModel.findById(params.id[0]); // پیدا کردن تیکت با استفاده از آیدی
        const answer = ticket.answer.id(params.id[1]); // پیدا کردن پاسخ با استفاده از آیدی

        if (answer?.imageUrl) // اگر پاسخ تصویر داشت
            if (existsSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl)))
                unlinkSync(path.join(process.cwd(), 'assets/uploads/ticket/' + answer.imageUrl)); // حذف تصویر

        ticket.answer.pull(answer); // حذف پاسخ از تیکت
        await ticket.save(); // ذخیره تیکت

        return Response.json({ message: 'با موفقیت حذف شد', dt: answer }); // ارسال پاسخ موفقیت
    } catch (error) {
        return Response.json(error?.message, { status: (error && error.status) || 500 }); // ارسال پاسخ خطا
    }
}
