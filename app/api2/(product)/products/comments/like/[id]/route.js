import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function POST(req, { params }) {
    const _user = JSON.parse(req.headers.get('user'));

    await dbConnect();

    const truLike = await ProductsModel.findOne(
        { 'comments._id': params.id, 'comments.like.userId': _user.userId },
        { 'comments.like.$': 1, 'comments.likeCount': 1 }
    );

    if (truLike?.comments[0]?.like.length) {
        truLike.comments[0].like[0].value = !truLike.comments[0].like[0].value;

        if (!truLike.comments[0].like[0].value) truLike.comments[0].likeCount--;
        else truLike.comments[0].likeCount++;
        await truLike.save();
        return Response.json(truLike);
    } else {
        const product = await ProductsModel.findOne(
            { 'comments._id': params.id },
            { 'comments.like.$': 1, 'comments.likeCount': 1 }
        );

        product.comments[0].like.push({ value: 1, userId: _user.userId });
        product.comments[0].likeCount++;
        await product.save();
        return Response.json(product);
    }
}
