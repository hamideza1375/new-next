import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function GET(req: Request, { params: {id} }: { params: { id: string } }) {
    await dbConnect()
    let product = await ProductsModel.findById(id)
    .select({comments:0, questions:0, parts:0, stars:0})
    if(!product) throw new Error('404')
    return Response.json(product);
}