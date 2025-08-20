import { IProduct, ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import errorHandling from '@/middleware/errorHandling';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import getUser from '@/utils/getUser';
import authAdminRoutes from '@/middleware/authAdminRoutes';
import { CustomError } from '@/utils/CustomError';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return errorHandling(async()=>{
    await dbConnect();
    const { message, to } = await req.json();

    await authAdminRoutes();
    const _user = getUser(req);

    const updateResult = await ProductsModel.updateOne(
      { 'comments._id': params.id },
      {
        $push: {
          'comments.$.answer': {
            username: _user.username,
            message,
            // to: to
          }
        }
      }
    );

    if (!updateResult.matchedCount) {
      return Response.json(
        { message: 'کامنت مورد نظر یافت نشد' },
        { status: 404 }
      );
    }

    const product = await ProductsModel.findOne({ 'comments._id': params.id }) as IProduct;

    if (!product) {
      return Response.json(
        { message: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    return Response.json({ 
      message: 'ساخته شد', 
      dt: product?.comments.id(params.id)?.answer 
    });

  });
}


export async function GET(req:NextRequest, { params }:{params:{id:string}}) {
    await dbConnect();

    const answer = await ProductsModel.aggregate([
        { $unwind: '$comments' },
        { $unwind: '$comments.answer' },
        { $match: { 'comments.answer._id': new mongoose.Types.ObjectId(params.id) } },
        { $replaceRoot: { newRoot: '$comments.answer' } }
    ]);

    return Response.json(answer[0] || {});
}


export async function PUT(req:NextRequest, { params }:{params:{id:string}}) {
    return errorHandling(async()=>{
    await dbConnect();

    const { message } = await req.json();

    const _user = getUser(req);

    if(!_user.isAdmin) return Response.json('شما مجوز این کار را ندارید', {status:429})


    const updatedAnswer = await ProductsModel.findOneAndUpdate(
        { 'comments.answer._id': params.id },
        {
            $set: { 'comments.$.answer.$[elem].message': message }
        },
        {
            arrayFilters: [{ 'elem._id': params.id }],
            new: true
        }
    );

    if(!updatedAnswer) return Response.json('کامنت مورد نظر یافت نشد', {status:404})

    return Response.json({ message: 'به‌روزرسانی شد', dt: updatedAnswer });
    })
}


export async function DELETE(req:NextRequest, { params }:{params:{id:string}}) {
    return errorHandling(async()=>{
    await dbConnect();

    const _user = getUser(req);

    if(!_user.isAdmin) return Response.json('شما مجوز این کار را ندارید', {status:429})


    const updatedProduct = await ProductsModel.findOneAndUpdate(
        { 'comments.answer._id': params.id },
        {
            $pull: { 'comments.$.answer': { _id: params.id } }
        },
        {
            new: true
        }
    );

    return Response.json({ message: 'حذف شد', dt: updatedProduct });
})
}
