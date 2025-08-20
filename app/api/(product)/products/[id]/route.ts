import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import { CustomError } from '@/utils/CustomError';
import dbConnect from '@/utils/dbConnect';
import mongoose from 'mongoose';

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
   return errorHandling(async () => {
      await dbConnect();

      // Validate if the provided ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         throw new CustomError({ message: 'شناسه محصول معتبر نیست', status: 400 });
      }

      let product = await ProductsModel.findById(id).select({ comments: 0, questions: 0, parts: 0, stars: 0 });
      if (!product) throw new CustomError({ message: 'محصول مورد نظر پیدا نشد', status: 404 });
      return Response.json(product);
   });
}
