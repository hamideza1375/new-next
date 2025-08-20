import authAdminRoutes from '@/middleware/authAdminRoutes';
import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';
import getUser from '@/utils/getUser';

export async function PUT(req) {
    return errorHandling(async()=>{

        await dbConnect();
        await authAdminRoutes();

        const id = req.nextUrl.searchParams.get('commentID');

        const _user = getUser(req);

        if (!_user.isAdmin) return Response.json('شما ادمین نیستید', { status: 403 });

        await ProductsModel.updateOne({ 'comments._id': id }, { $set: { 'comments.$.show': true } });

        const updatedComment = await ProductsModel.findOne({ 'comments._id': id });
        return Response.json({ message: 'کامنت به لیست افزوده شد', dt: updatedComment.comments.id(id) });
    })
}
