import authAdminRoutes from '@/middleware/authAdminRoutes';
import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function PUT(req) {
    return errorHandling(async()=>{

        await dbConnect();
        await authAdminRoutes(req);

        const id = req.nextUrl.searchParams.get('commentID');

        const _user = JSON.parse(req.headers.get('user'));

        if (!_user.isAdmin) return Response.json('شما ادمین نیستید', { status: 403 });

        await ProductsModel.updateOne({ 'comments._id': id }, { $set: { 'comments.$.show': true } });

        const updatedComment = await ProductsModel.findOne({ 'comments._id': id });
        return Response.json({ message: 'کامنت به لیست افزوده شد', dt: updatedComment.comments.id(id) });
    })
}
