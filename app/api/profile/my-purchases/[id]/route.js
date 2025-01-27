import authUserRoutes from '@/middleware/authUserRoutes';
import errorHandling from '@/middleware/errorHandling';
import optimizeImageCertificate from '@/middleware/imageUpload-certificate';
import { CertificateModel } from '@/models/CertificateModel';

// این تابع برای ثبت درخواست مدرک از سوی کاربر است
// چک می کند که آیا کاربر لاگین کرده است یا خیر authUserRoutes سپس با استفاده از میانی افزار
// اگر لاگین کرده بود، اطلاعات کاربر را از هدر می گیرد
// چک می کند که آیا قبلا درخواستی با این عنوان ثبت شده است یا خیر CertificateModel سپس با استفاده از مدل
// اگر ثبت شده بود، به کاربر پیغام می دهد که درخواست قبلا ثبت شده است
// تصویر را اپلود می کند optimizeImageCertificate در غیر این صورت، با استفاده از میانی افزار
// درخواست را ثبت می کند CertificateModel و سپس با استفاده از مدل
// و در نهایت به کاربر پیغام می دهد که درخواست ثبت شده است

export async function POST(req, {params}) {
    return errorHandling(async()=>{
        // چک لاگین کاربر
        await authUserRoutes(req);
        const _user = JSON.parse(req.headers.get('user'));
        // چک کردن اینکه آیا قبلا درخواستی با این عنوان ثبت شده است یا خیر
        const certificate = await CertificateModel.findOne({ userId: _user.userId, title: params.id  })
        if(certificate) return Response.json({message:'درخواست مدرک برای این دوره قبلا ثبت شده است'}, {status: 429});
        // دریافت اطلاعات از فرم
        const formdata = await req.formData();
        const { image } = Object.fromEntries(formdata);
        // اپلود تصویر
        const filename = await optimizeImageCertificate(image);
        // ثبت درخواست
        await CertificateModel.create({ userId: _user.userId, imageUrl: filename, title: params.id  })
        // ارسال پاسخ به کاربر
        return Response.json({message:'درخواست شما ثبت و در صورت درست بودن اطلاعات تا ۲۴ ساعت آینده انجام میشود'});
    })
}
