import authAdminRoutes from '@/middleware/authAdminRoutes';
import errorHandling from '@/middleware/errorHandling';
import { ProductsModel } from '@/models/ProductModel';
import dbConnect from '@/utils/dbConnect';

export async function GET() {
    errorHandling(async()=>{
   
        // اتصال به دیتابیس
        await dbConnect();
        
        // بررسی احراز هویت ادمین
        await authAdminRoutes();

        // اجرای کوئری برای دریافت نظرات
        const comments = await ProductsModel.aggregate([
            // باز کردن آرایه نظرات
            { $unwind: '$comments' },
            // فیلتر کردن نظراتی که نمایش داده نمی‌شوند
            { $match: { 'comments.show': { $ne: true } } },
            {
                // اتصال به جدول کاربران
                $lookup: {
                    from: 'users', // تغییر از 'signs' به 'users' (باید مطابق با نام collection کاربران باشد)
                    localField: 'comments.user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            // باز کردن آرایه کاربران
            { $unwind: '$user' },
            // جایگزینی ریشه با ترکیب اطلاعات کاربر و نظر
            { 
                $replaceRoot: { 
                    newRoot: { 
                        $mergeObjects: [
                            { 
                                email: '$user.email', 
                                mainId: '$$ROOT._id' 
                            }, 
                            '$comments'
                        ] 
                    } 
                } 
            },
            // حذف فیلدهای غیر ضروری
            { $project: { user: 0, answer: 0 } }
        ]).exec();

        // بازگشت نظرات به صورت JSON
        return new Response(JSON.stringify(comments), {
            headers: { 'Content-Type': 'application/json' }
        });
    });

}