import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function GET() {
    await dbConnect()
    let offers = await ProductsModel.find({ 'offer.exp': { $gt: new Date().getTime() } }).sort({ data: -1 });
    return Response.json(offers);
}
