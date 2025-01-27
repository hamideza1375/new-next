import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function GET(req, { params }) {
    await dbConnect();

    let product = await ProductsModel.findOne(
        { 'parts._id': params.id }
    )

    if(!product) return Response.json('دوره ی مورد نظر پیدا نشد',{status:404})
    if(!product) throw new Error('404')

    let productObject = product.toObject();
    delete productObject.parts;

    const part = product.parts.id(params.id);
    if(!part) throw new Error('404')

    return Response.json({ ...productObject, mainID: productObject._id ,title: part.title, des: part.des, videoUrl: part.videoUrl, chapter:part.chapter /* offer:product.offer */ });
}
