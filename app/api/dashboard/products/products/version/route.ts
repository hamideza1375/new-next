import authAdminRoutes from '@/middleware/authAdminRoutes';
import { IProduct, ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest): Promise<Response> {
    try {
        await dbConnect();
        await authAdminRoutes();
        const { version }: { version: number } = await req.json();

        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return Response.json({ message: 'شناسه محصول الزامی است' }, { status: 400 });
        }
        const product = (await ProductsModel.findById(productId)) as IProduct;
        if (!product) {
            return Response.json({ message: 'محصول یافت نشد' }, { status: 404 });
        }

        product.version = version;
        await product.save();
        return Response.json({ message: 'تغییرات ذخیره شد', dt: product }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}


export async function GET(req: NextRequest): Promise<Response> {
    try {
        await dbConnect();
        await authAdminRoutes();

        const productId = req.nextUrl.searchParams.get('productID');
        if (!productId) {
            return Response.json({ message: 'شناسه محصول الزامی است' }, { status: 400 });
        }
        const product = (await ProductsModel.findById(productId).select('version')) as IProduct;
        if (!product) {
            return Response.json({ message: 'محصول یافت نشد' }, { status: 404 });
        }

        return Response.json(product.version);
    } catch (error: any) {
        return Response.json(error?.message, { status: (error && error.status) || 500 });
    }
}
