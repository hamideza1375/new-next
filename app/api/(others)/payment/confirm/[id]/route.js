import dbConnect from '@/utils/dbConnect';
import { decode } from 'jsonwebtoken';
import ZarinPalCheckout from 'zarinpal-checkout';
const { PaymentsModel } = require('@/models/PaymentsModel');
const { ProductsModel } = require('@/models/ProductModel');
const { NextRequest } = require('next/server');
const zarinpal = ZarinPalCheckout.create('00000000-0000-0000-0000-000000000000', true);

// export const dynamic = 'force-dynamic'
// export const fetchCache = 'force-no-store'

/**
 * این رندر در صورتی که کاربر برای خرید یک محصول جدید آمده باشد اجرا می شود
 * @param {NextRequest} req 
 * @param {() => void} 
 */
export async function GET(req, { params }) {
    // اگر کاربر فرستاده شده از طرف نماینده باشد مبلغ را 10 درصد کاهش می دهیم
    const increment = req.nextUrl.searchParams.get('representative') ? 10 : 0

    const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
    const htmlPage = generateHtmlPage({pageTitle: 'داده ها به سرور ارسال نشدن دوباره امتحان کنید',status: 'error'});
    const htmlPage2 = generateHtmlPage({ pageTitle: 'شما این دوره را قبلا خریداری کردین', status: 'error' });

    try {
        await dbConnect();
        const _user = decode(req.cookies.get('httpToken')?.value, 'httpToken')
        const product = await ProductsModel.findById(params.id).select('title price version offer');

        if (!product) return new Response(htmlPage, { status: 429, headers });

        if(!_user) return Response.redirect(new URL('/sign', req.url))

        if (_user?.products && _user.products.find(p=>p.productId === params.id)?.productId) return new Response(htmlPage2, { status: 429, headers });

        // بدست آوردن قیمت
        const price = Number(
            ((!representative) && (!product.offer?.exp || product.offer.exp <= new Date().getTime()))
                ? product.price
                : product.price - (product.price / 100) * ((product.offer?.value && product.offer.exp > new Date().getTime() && Number(product.offer.value) > 0) ? Number(product.offer.value) + increment : increment)
        )

        // بدست آوردن آدرس کامل
        const protocol = req.headers.get('x-forwarded-proto');
        const host = req.headers.get('host');

        // ارسال درخواست به زرین پال
        const response = await zarinpal.PaymentRequest({
            Amount: String(price),
            CallbackURL: `${protocol}://${host}/api/payment/verifyPayment`,
            Description: product.title,
            // Email: _user.email
        });

        if (response.status !== 100) {
            return new Response(htmlPage, { status: 500, headers });
        }

        // ذخیره پرداخت
        await PaymentsModel.create({
            ...representative && { representative },
            userId: _user.userId,
            price: String(price),
            title: product.title,
            productId: product._id,
            version: product.version,
            authority: response.authority,
            date: new Date()
        });

        // بازگشت به کاربر
        return Response.redirect(response.url);
    } catch (error) {
        console.log(error);
        return new Response(htmlPage, { status: 500, headers });
    }
}


/**
 * تابعی که صفحه ی html را برای کاربر نمایش می دهد
 * @param {object} payment 
 */
function generateHtmlPage(payment) {
    return `<!DOCTYPE html>
	  <html>
		 <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
			<title>${payment.pageTitle}</title>
		 </head>
		 <body>
			<h1 style="color:red;text-align:center" >${payment.pageTitle}</h1>
		 </body>
	  </html>`;
}

