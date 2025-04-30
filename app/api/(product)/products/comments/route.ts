import errorHandling from '@/middleware/errorHandling';
import authUserRoutes from '@/middleware/authUserRoutes';
import { IProduct, ProductsModel } from '@/models/ProductModel';
import getUser from '@/utils/getUser';
import dbConnect from '@/utils/dbConnect';
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
        
        const product = await ProductsModel.findOne({ _id: searchParams.get('productID') })
            .slice('comments', -100)
            .populate('comments.user', '-_id email')
            .lean()
            .then((product) => product?.comments.reverse() || []);

        return Response.json(product);
    } catch (error) {
        console.log(error);
        return Response.json([]);
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