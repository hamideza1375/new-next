import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<Response> {
    await dbConnect();

    let product = await ProductsModel.findOne({ 'parts._id': params.id });

    if (!product) return Response.json('دوره ی مورد نظر پیدا نشد', { status: 404 });
    if (!product) throw new Error('404');

    let productObject = product.toObject() as any;
    delete productObject.parts;

    const part = product.parts.id(params.id);
    if (!part) throw new Error('404');

    return Response.json({
        ...productObject,
        mainID: productObject._id,
        title: part.title,
        description: part.description,
        videoUrl: part.videoUrl,
        chapter: part.chapter /* offer:product.offer */
    });
}
