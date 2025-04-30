import { CategoriesModel } from '@/models/CategoriesModel';
import { ICategory } from '@/models/CategoriesModel';
import dbConnect from '@/utils/dbConnect';
import { writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import authAdminRoutes from '@/middleware/authAdminRoutes';

interface Params {
    id: string;
}

// تابع GET برای دریافت دسته‌بندی بر اساس شناسه
export async function GET(
    req: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();
        
        const category: ICategory | null = await CategoriesModel.findById(params.id);
        
        if (!category) {
            return NextResponse.json(
                { error: 'دسته‌بندی یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('خطا در دریافت دسته‌بندی:', error);
        return NextResponse.json(
            { error: error?.message || 'خطای سرور' },
            { status: error?.status || 500 }
        );
    }
}

// تابع PUT برای به‌روزرسانی دسته‌بندی
export async function PUT(
    req: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes();

        const category: ICategory | null = await CategoriesModel.findById(params.id);
        
        if (!category) {
            return NextResponse.json(
                { error: 'این گزینه از سرور حذف شده است' },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('image') as File | null;
        const title = formData.get('title') as string | null;

        if (!title) {
            return NextResponse.json(
                { error: 'عنوان الزامی است' },
                { status: 400 }
            );
        }

        // اگر فایل جدید ارسال شده باشد
        if (file) {
            // اعتبارسنجی نوع فایل
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    { error: 'فایل باید یک تصویر باشد' },
                    { status: 400 }
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now().toString(32)}${Math.floor(
                Math.random() * 89999 + 10000
            )}_${file.name.replace(/\s+/g, '_')}`;
            
            const uploadPath = path.join(
                process.cwd(), 
                'assets/uploads/product/', 
                filename
            );

            try {
                await writeFile(uploadPath, buffer);
                
                // حذف فایل قبلی اگر وجود داشته باشد
                const oldImagePath = path.join(
                    process.cwd(), 
                    'assets/uploads/product/', 
                    category.image
                );
                
                if (existsSync(oldImagePath)) {
                    await unlink(oldImagePath);
                }
                
                category.image = filename;
            } catch (error) {
                console.error('خطا در مدیریت فایل‌ها:', error);
                return NextResponse.json(
                    { error: 'خطا در ذخیره تصویر' },
                    { status: 500 }
                );
            }
        }

        category.title = title;
        await category.save();

        return NextResponse.json(
            { data: category },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('خطا در به‌روزرسانی دسته‌بندی:', error);
        return NextResponse.json(
            { error: error?.message || 'خطای سرور' },
            { status: error?.status || 500 }
        );
    }
}

// تابع DELETE برای حذف دسته‌بندی (غیرفعال شده)
/*
export async function DELETE(
    req: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    try {
        await dbConnect();
        await authAdminRoutes(req);
        
        const category = await CategoriesModel.findByIdAndDelete(params.id);
        
        if (!category) {
            return NextResponse.json(
                { error: 'دسته‌ای با این مشخصات پیدا نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: category },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('خطا در حذف دسته‌بندی:', error);
        return NextResponse.json(
            { error: error?.message || 'خطای سرور' },
            { status: error?.status || 500 }
        );
    }
}
*/