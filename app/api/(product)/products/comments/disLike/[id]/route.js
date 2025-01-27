import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function POST(req, { params }) {
    const _user = JSON.parse(req.headers.get('user'));

    await dbConnect();

    const truLike = await ProductsModel.findOne(
        { 'comments._id': params.id, 'comments.disLike.userId': _user.userId },
        { 'comments.disLike.$': 1, 'comments.disLikeCount': 1 }
    );

    if (truLike?.comments[0]?.disLike.length) {
        truLike.comments[0].disLike[0].value = !truLike.comments[0].disLike[0].value;

        if (!truLike.comments[0].disLike[0].value) truLike.comments[0].disLikeCount--;
        else truLike.comments[0].disLikeCount++;
        await truLike.save();
        return Response.json(truLike);
    } else {
        const product = await ProductsModel.findOne(
            { 'comments._id': params.id },
            { 'comments.disLike.$': 1, 'comments.disLikeCount': 1 }
        );

        product.comments[0].disLike.push({ value: 1, userId: _user.userId });
        product.comments[0].disLikeCount++;
        await product.save();
        return Response.json(product);
    }
}
