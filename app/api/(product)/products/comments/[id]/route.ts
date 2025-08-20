import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import { IComment, ProductsModel } from '@/models/ProductModel';
import { IUser } from '@/models/UsersModel';
import { CustomError } from '@/utils/CustomError';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';
import { NextRequest, NextResponse } from 'next/server';

interface PopulatedComment extends Omit<IComment, 'user'> {
    user: {
        email: string;
    };
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
return errorHandling(async()=>{
        await dbConnect();
    
    const product = await ProductsModel.findOne(
        { 'comments._id': params.id }, 
        { 'comments.$': 1 }
    ).lean();
    
    const comment = product?.comments?.[0] || {} as Partial<PopulatedComment>;

    if(!Object.keys(comment).length) throw new CustomError({message:'کامنت مورد نظر پیدا نشد', status:404})
    

    const _comment = {
        message: comment.message || '',
        star: comment.rating || 0
    };

    return Response.json(_comment);
})
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return errorHandling(async () => {
        await dbConnect();
        await authUserRoutes();

        const { message, star }: { message: string; star: number } = await req.json();

        const product = await ProductsModel.findOne({ 'comments._id': params.id })
            .populate('comments.user', '-_id email');
        
        if (!product) {
            return Response.json('کامنت یافت نشد', { status: 404 });
        }

        const comment = product.comments.id(params.id) as PopulatedComment;
        if (!comment) {
            return Response.json('کامنت یافت نشد', { status: 404 });
        }

        const _user = getUser(req);

        if (comment.user.email !== _user.email && !_user.isAdmin) {
            return Response.json('شما مجوز این کار را ندارید', { status: 403 });
        }

        const updatedProduct = await ProductsModel.findOneAndUpdate(
            { 'comments._id': params.id },
            { 
                $set: { 
                    'comments.$.message': message, 
                    'comments.$.star': star, 
                    'comments.$.show': false 
                } 
            },
            { new: true }
        );

        if (!updatedProduct) {
            return Response.json('محصول یافت نشد', { status: 404 });
        }

        // Recalculate meanStar
        if (updatedProduct.comments.length > 0) {
            const total = updatedProduct.comments.reduce(
                (total: number, comment: IComment) => total + comment.rating, 0
            );

            updatedProduct.ratings = total;
            updatedProduct.rating = total / updatedProduct.comments.length;
        } else {
            updatedProduct.rating = 0;
            updatedProduct.ratings = 0;
        }

        await updatedProduct.save();

        return Response.json({
            message: 'پیام شما ویرایش شد و بعد از تایید ادمین در سایت قرار میگیرد'
        });
    });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return errorHandling(async () => {
        await dbConnect();

        const product = await ProductsModel.findOne({ 'comments._id': params.id })
            .populate('comments.user', '-_id email');
        
        if (!product) {
            return Response.json('کامنت یافت نشد', { status: 404 });
        }

        const comment = product.comments.id(params.id) as PopulatedComment;
        if (!comment) {
            return Response.json('کامنت یافت نشد', { status: 404 });
        }

        const userHeader = req.headers.get('user');
        if (!userHeader) {
            return Response.json('هدر کاربر وجود ندارد', { status: 400 });
        }

        const _user: IUser = JSON.parse(userHeader);
        if (comment.user.email !== _user.email && !_user.isAdmin) {
            return Response.json('شما مجوز این کار را ندارید', { status: 403 });
        }

        const updatedProduct = await ProductsModel.findOneAndUpdate(
            { 'comments._id': params.id },
            { $pull: { comments: { _id: params.id } } },
            { new: true }
        );

        if (!updatedProduct) {
            return Response.json('محصول یافت نشد', { status: 404 });
        }

        // Recalculate meanStar
        if (updatedProduct.comments.length > 0) {
            const total = updatedProduct.comments.reduce(
                (total: number, comment: IComment) => total + comment.rating, 0
            );

            updatedProduct.ratings = total;
            updatedProduct.rating = total / updatedProduct.comments.length;
        } else {
            updatedProduct.rating = 0;
            updatedProduct.ratings = 0;
        }

        await updatedProduct.save();

        return Response.json(updatedProduct);
    });
}