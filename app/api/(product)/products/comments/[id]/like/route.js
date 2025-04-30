import dbConnect from '@/utils/dbConnect';
import {ProductsModel} from '@/models/ProductModel';

export async function POST(req, { params }) {
    return errorHandling(async () => {
        await dbConnect();

        const { id } = await params;
        const productId = searchParams.get('productID');
        const _user = JSON.parse(req.headers.get('user'));

        if (!_user?.userId) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const product = await ProductsModel.findById(productId);

        const comment = product.comments.id(id);
        if (!comment) {
            return Response.json({ message: 'کامنت یافت نشد' }, { status: 404 });
        }

        const likeIndex = comment.likes.findIndex(userId => userId.toString() === _user.userId.toString());

        let action;
        if (likeIndex === -1) {
            comment.likes.push(_user.userId);
            comment.likeCount += 1;
            action = 'liked';
        } else {
            comment.likes.splice(likeIndex, 1);
            comment.likeCount -= 1;
            action = 'unliked';
        }

        await product.save();

        return Response.json({
            success: true,
            action,
            likeCount: comment.likeCount
        });
    });
}



// مثال استفاده در React component
// const handleLike = async (productId, commentId) => {
//     try {
//         const response = await fetch(`/api/products/comments/${commentId}/like?productId=${productId}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ userId: currentUser._id }) // userId باید از state گرفته شود
//         });

//         const data = await response.json();

//         if (data.success) {
//             // به روزرسانی UI بر اساس action و likeCount
//             console.log(`Comment ${data.action}. Total likes: ${data.likeCount}`);
//         }
//     } catch (error) {
//         console.error('Error liking comment:', error);
//     }
// };
