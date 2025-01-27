// وارد کردن مدل محصولات
import { ProductsModel } from '@/models/ProductModel';
// وارد کردن تابع اتصال به دیتابیس
import dbConnect from '@/utils/dbConnect';

// تابع GET برای دریافت اطلاعات
export async function GET(req, { params }) {
    // اتصال به دیتابیس
    await dbConnect();
    // پیدا کردن محصولی که سوال مورد نظر را دارد
    const product = await ProductsModel.findOne({
        'questions._id': req.nextUrl.searchParams.get('answerID')
    }).select('questions');
    // پیدا کردن سوال مورد نظر از محصول
    const question = product.questions.id(req.nextUrl.searchParams.get('answerID'));

    // تبدیل سوال به یک آبجکت ساده
    let _question = question.toObject();
    // حذف پاسخ از سوال
    delete _question.answer;
    // حذف شناسه کاربر از سوال
    delete _question.userId;

    // بازگشت پاسخ به صورت JSON
    return Response.json([_question, ...question.answer]);
}
