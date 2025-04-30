import { ObjectId, ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import errorHandling from '@/middleware/errorHandling';

export async function POST(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();
    const { message, to } = await req.json();

    const _user = JSON.parse(req.headers.get('user'));

    if(!_user.isAdmin) return Response.json('شما مجوز این کار را ندارید', {status:429})

    await ProductsModel.updateOne(
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
    
    const updatedComment = await ProductsModel.findOne({ 'comments._id': params.id });
    return Response.json({ message: 'ساخته شد', dt: updatedComment.comments.id(params.id).answer });
})
}

export async function GET(req, { params }) {
    await dbConnect();

    const answer = await ProductsModel.aggregate([
        { $unwind: '$comments' },
        { $unwind: '$comments.answer' },
        { $match: { 'comments.answer._id': new ObjectId(params.id) } },
        { $replaceRoot: { newRoot: '$comments.answer' } }
    ]);

    return Response.json(answer[0] || {});
}


export async function PUT(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();

    const { message } = await req.json();

    const _user = JSON.parse(req.headers.get('user'));

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

    return Response.json({ message: 'به‌روزرسانی شد', dt: updatedAnswer });
    })
}


export async function DELETE(req, { params }) {
    return errorHandling(async()=>{
    await dbConnect();

    const _user = JSON.parse(req.headers.get('user'));

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
