import errorHandling from '@/middleware/errorHandling';
import { ProfileModel } from '@/models/ProfileModel';
import dbConnect from '@/utils/dbConnect';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';

// این تابع برای آپلود تصویر پروفایل می باشد
export async function POST(req) {
    return errorHandling(async ()=> {
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));
    const formdata = await req.formData();
    const { image } = Object.fromEntries(formdata);
    let buffer, filename;

    if (!image) return Response.json('بعدا دوباره امتحان کنید', { status: 400 });

    // اگر پروفایل قبلا داشته باشد آن را حذف می کند
    let profileImage = await ProfileModel.findOne({ userId: _user.userId });
    if (profileImage) {
        if (existsSync(path.join(process.cwd(), 'assets/uploads/profile/' + profileImage.imageUrl))) unlinkSync(path.join(process.cwd(), 'assets/uploads/profile/' + profileImage.imageUrl));
    }
    // سپس پروفایل قبلی را حذف می کند
    await ProfileModel.deleteMany({ userId: _user.userId });

    // تصویر را در فرمتی که میخواهیم تبدیل می کنیم
    buffer = Buffer.from(await image.arrayBuffer());
    // نام فایل را ایجاد می کنیم
    filename = Date.now().toString('32') + '' + Math.floor(Math.random() * 99999 + 10000) + '_' + image.name;
    // تصویر را در سرور ذخیره می کنیم
    writeFileSync(path.join(process.cwd(), 'assets/uploads/profile/' + filename), buffer);

    // پروفایل جدید را در دیتابیس ثبت می کنیم
    await ProfileModel.create({ imageUrl: filename, userId: _user.userId });
    return Response.json({ message: 'تصویر با موفقیت بروزرسانی شد', imageUrl: req.fileName });
    })
}

// این تابع برای دریافت تصویر پروفایل می باشد
export async function GET(req) {
    await dbConnect();
    const _user = JSON.parse(req.headers.get('user'));

    // پروفایل کاربر را دریافت می کنیم
    const profile = await ProfileModel.findOne({ userId: _user.userId }).select({userId:0})

    // اگر پروفایل داشته باشد آن را بر میگرداند
    if (profile) return Response.json(profile);
    // در غیر این صورت خالی بر میگرداند
    else return Response.json('');
}


