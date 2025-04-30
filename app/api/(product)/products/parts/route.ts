// وارد کردن مدل محصولات و تابع اتصال به دیتابیس
import { IProduct, ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest } from 'next/server';

// تعریف انواع TypeScript
interface Part {
    _id: string;
    title: string;
    videoUrl?: string;
    sourceUrl?: string;
    chapter: number;
    // سایر فیلدهای مورد نیاز
}

interface Product {
    _id: string;
    title: string;
    videoUrl?: string;
    times?: number;
    progress?: number;
    parts: Part[];
    // سایر فیلدهای محصول
}

// تابع GET برای دریافت اطلاعات محصول
export async function GET(request: NextRequest): Promise<Response> {
    try {
        // اتصال به دیتابیس
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;
        const productID = searchParams.get('productID');
        const partID = searchParams.get('partID');

        // یافتن محصول بر اساس productID یا partID
        let product;

        if (productID) {
            product = await ProductsModel.findById(productID)
                .select(
                    'title videoUrl times progress parts._id parts.title parts.videoUrl parts.sourceUrl parts.chapter'
                )
                .lean();
        } else if (partID) {
            product = await ProductsModel.findOne({ 'parts._id': partID })
                .select(
                    'title videoUrl times progress parts._id parts.title parts.videoUrl parts.sourceUrl parts.chapter'
                )
                .lean();
        }

        // اگر محصول پیدا نشد
        if (!product) {
            return Response.json({ error: 'دوره ی مورد نظر پیدا نشد' }, { status: 404 });
        }

        // مرتب سازی بخش‌ها بر اساس شماره فصل
        const sortedParts = [...product.parts].sort((a, b) => a.chapter - b.chapter);

        // ایجاد کپی از محصول بدون بخش‌ها
        const productWithoutParts: Omit<IProduct, 'parts'> & { parts?: unknown } = { ...product };
        delete productWithoutParts.parts;

        // const productWithoutParts = { ...product } as any;
        // delete productWithoutParts.parts;

        // const productWithoutParts = { ...product };
        // delete productWithoutParts.parts;

        // بازگشت پاسخ شامل اطلاعات محصول و بخش‌های مرتب‌شده
        return Response.json([productWithoutParts, ...sortedParts]);
    } catch (error) {
        console.error('Error in product API:', error);
        return Response.json({ error: 'خطای سرور داخلی' }, { status: 500 });
    }
}
