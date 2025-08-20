import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import { IProduct, ProductsModel } from '@/models/ProductModel';
import { CustomError } from '@/utils/CustomError';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';
import { NextRequest } from 'next/server';

interface Comment {
    message: string;
    star: number;
    username: string;
    user: string;
    email: string;
    // Add other properties if needed
}

interface Product {
    comments: Comment[];
    stars?: number;
    meanStar?: number;
    save(): Promise<Product>;
}

interface User {
    username: string;
    userId: string;
    email: string;
    // Add other properties if needed
}


export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const productID = searchParams.get('productID');
    const page = parseInt(searchParams.get('page') || '1');
    const commentsPerPage = 10;

    // محاسبه تعداد کامنت‌هایی که باید skip شوند
    const skipCount = (page - 1) * commentsPerPage;

    const comments = await ProductsModel.findOne({ _id: productID }, {
      comments: { $slice: [ - (skipCount + commentsPerPage), commentsPerPage ] }
    })
    .populate('comments.user', '-_id email')
    .lean()
    .then((product) => product?.comments.reverse() || []);

    return Response.json(comments || { comments: [] });
  } catch (error) {
    console.log(error);
    return Response.json({ comments: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    return errorHandling(async () => {
        await dbConnect();
        await authUserRoutes();

        const searchParams = request.nextUrl.searchParams;
        const _user = getUser(request);

        const { message, rating } = await request.json();

        const product = await ProductsModel.findById(searchParams.get('productID')) as IProduct;

        if(!product) throw new CustomError({message:'محصول مورد نظر پیدا نشد', status:404})

        product.comments.push({
            message,
            rating,
            username: _user.username,
            user: _user.userId
        });

        product.ratings = (product.ratings || 0) + Number(rating);
        product.rating = (product.ratings || 0) / product.comments.length;

        await product.save();

        return Response.json({
            message: 'کامنت شما ارسال شد و بعد از تایید مدیر در سایت قرار میگیرد'
        });
    });
}