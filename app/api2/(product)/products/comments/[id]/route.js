import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function GET(req, { params }) {
    await dbConnect();
    const comment = await ProductsModel.findOne({ 'comments._id': params.id }, { 'comments.$': 1 }).then(
        p => p?.comments[0] || {}
    );

    const _comment = {
        message: comment.message,
        star: comment.star
    };

    return Response.json(_comment);
}

export async function PUT(req, { params }) {
    return errorHandling(async()=>{
        await dbConnect();
        await authUserRoutes(req);

        const { message, star } = await req.json();

        const comment = await ProductsModel.findOne({ 'comments._id': params.id })
            .populate('comments.userId', '-_id email')
            .then(p => p.comments.id(params.id));

        const _user = JSON.parse(req.headers.get('user'));
        if (comment.userId.email !== _user.email && !_user.isAdmin)
            return Response.json('شما مجوز این کار را ندارید', { status: 429 });

        const updatedProduct = await ProductsModel.findOneAndUpdate(
            { 'comments._id': params.id },
            { $set: { 'comments.$.message': message, 'comments.$.star': star, 'comments.$.show': false } },
            { new: true }
        );

        // محاسبه مجدد meanStar
        if (updatedProduct.comments.length > 0) {
            const total = updatedProduct.comments.reduce((total, comment) => total + comment.star, 0);

            updatedProduct.stars = total;

            updatedProduct.meanStar = total / updatedProduct.comments.length;
        } else {
            updatedProduct.meanStar = 0;
            updatedProduct.stars = 0;
        }

        // ذخیره تغییرات
        await updatedProduct.save();

        return Response.json({
            message: 'پیام شما ویرایش شد و بعد از تایید ادمین در سایت قرار میگیرد' /* dt: updatedProduct */
        });
    })
}

export async function DELETE(req, { params }) {
    return errorHandling(async()=>{

    await dbConnect();

    const comment = await ProductsModel.findOne({ 'comments._id': params.id })
        .populate('comments.userId', '-_id email')
        .then(p => p.comments.id(params.id));

    const _user = JSON.parse(req.headers.get('user'));
    if (comment.userId.email !== _user.email && !_user.isAdmin)
        return Response.json('شما مجوز این کار را ندارید', { status: 429 });

    // حذف کامنت
    const updatedProduct = await ProductsModel.findOneAndUpdate(
        { 'comments._id': params.id },
        { $pull: { comments: { _id: params.id } } },
        { new: true }
    );

    // محاسبه مجدد meanStar
    if (updatedProduct.comments.length > 0) {
        const total = updatedProduct.comments.reduce((total, comment) => total + comment.star, 0);

        updatedProduct.stars = total;

        updatedProduct.meanStar = total / updatedProduct.comments.length;
    } else {
        updatedProduct.meanStar = 0;
        updatedProduct.stars = 0;
    }

    // ذخیره تغییرات
    await updatedProduct.save();

    return Response.json(updatedProduct);
})
}
