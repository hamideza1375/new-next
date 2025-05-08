import errorHandling from '@/middleware/errorHandling';
import { IComment, ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';



export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    return errorHandling(async () => {
        await dbConnect();

        const { id } = params;
        const productId = req.nextUrl.searchParams.get('productID');

        if (!productId) return Response.json({ message: 'Product ID is required' }, { status: 400 });

        const _user = getUser(req);

        if (!_user?.userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });

        const product = await ProductsModel.findById(productId);
        if (!product) return Response.json({ message: 'محصول یافت نشد' }, { status: 404 });

        const comment = product.comments.id(id) as IComment;
        if (!comment) return Response.json({ message: 'کامنت یافت نشد' }, { status: 404 });

        const likeIndex = comment.likes?.findIndex(userId => userId.toString() === _user.userId.toString());

        let action: 'liked' | 'unliked';
        if (likeIndex === -1) {
            comment.likes.push(new Types.ObjectId(_user.userId));
            comment.likeCount += 1;
            action = 'liked';
        } else {
            comment.likes.splice(likeIndex, 1);
            comment.likeCount -= 1;
            action = 'unliked';
        }

        await product.save();

        return Response.json({ action, likeCount: comment.likeCount });
    });
}
