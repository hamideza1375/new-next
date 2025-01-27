import { PaymentsModel } from '@/models/PaymentsModel';
import { SignModel } from '@/models/SignModel';
import dbConnect from '@/utils/dbConnect';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import ZarinPalCheckout from 'zarinpal-checkout';
const zarinpal = ZarinPalCheckout.create('00000000-0000-0000-0000-000000000000', true);

export const dynamic = 'force-dynamic';

/**
 * در این تابع وضعیت پرداخت را بررسی می کنیم
 * اگر پرداخت موفق بود اطلاعات کاربر را در کوکی ها ذخیره می کنیم
 * در غیر این صورت خطا را نمایش می دهیم
 */
export async function GET(req) {
    // صفحه ارور برای پرداخت نشده
    const htmlPage1 = generateHtmlPage({ pageTitle: 'پرداخت انجام نشد', status: 'error' });
    // صفحه ارور نامشخص
    const htmlPage2 = generateHtmlPage({
        pageTitle: 'خطای نامشخص',
        h2: 'چک کنید پرداخت انجام شده یا خیر',
        status: 'error'
    });
    // صفحه ارور برای خطای نامشخص
    const htmlPage3 = generateHtmlPage({ pageTitle: 'خطای نامشخص رخ داد', status: 'error' });
    const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });

    try {
        // ارتباط با دیتابیس برقرار می کنیم
        await dbConnect();

        // اطلاعات پرداخت را از کوئری دریافت می کنیم
        const authority = req.nextUrl.searchParams.get('Authority');
        const Status = req.nextUrl.searchParams.get('Status');

        // پرداخت مربوطه را از دیتابیس دریافت می کنیم
        const payment = await PaymentsModel.findOne({ authority });
        const user = await SignModel.findById(payment.userId);

        // وضعیت پرداخت را از زرین پال دریافت می کنیم
        const response = await zarinpal.PaymentVerification({
            Amount: String(payment.price),
            Authority: authority
        });

        // اگر پرداخت انجام نشده بود و وضعیت تایید بود، خطا می دهیم
        if (response.status !== 100 && Status === 'OK') {
            return new Response(htmlPage2, { status: 500, headers });
        } else if (response.status !== 100) {
            // اگر خطای نامشخص بود، خطا می دهیم
            return new Response(htmlPage3, { status: 500, headers });
        }

        // اگر پرداخت موفق بود
        if (Status === 'OK') {
            // اطلاعات پرداخت را در دیتابیس به روز می کنیم
            payment.RefID = response.RefID;
            payment.success = true;
            await payment.save();

            // اطلاعات کاربر را به روز می کنیم
            user.products.push({ productId: String(payment.productId), version: payment.version });
            await user.save();

            // اطلاعات کاربر را در کوکی ها ذخیره می کنیم
            const forUserIdToken = {
                ...(user.sellerId && { sellerId: user.sellerId }),
                userId: user._id,
                email: user.email,
                products: user.products,
                username: user.username,
            };

            const cookieStore = cookies();
            const httpToken = sign(forUserIdToken, 'httpToken');
            cookieStore.set('httpToken', httpToken, { maxAge: 60 * 1000 * 60 * 24 * 30, httpOnly: true });

            const forToken = {
                username: user.username,
                email: user.email,
                products: user.products,
                ...(user.sellerId && { sellerId: user.sellerId })
            };
            const token = sign(forToken, 'token');
            cookieStore.set('token', token, { maxAge: 60 * 1000 * 60 * 24 * 30 });

            // صفحه ارور برای پرداخت موفق
            const htmlPage = generateHtmlPage({
                pageTitle: 'پرداخت موفق',
                username: user.username,
                email: user.email,
                price: payment.price,
                title: payment.title,
                RefID: response.RefID,
                location: `${req.headers.get('x-forwarded-proto')}://${req.headers.get('host')}/product/${payment.productId}`,
                status: 'OK'
            });

            return new Response(htmlPage, { status: 200, headers });
        } else {
            throw new Error();
        }
    } catch (error) {
        console.log(error);
        return new Response(htmlPage1, { status: 500, headers });
    }
}

/**
 * در این تابع یک صفحه html تولید می کنیم که وضعیت پرداخت را نمایش می دهد
 * اگر پرداخت موفق بود اطلاعات کاربر را نمایش می دهیم
 * در غیر این صورت خطا را نمایش می دهیم
 */
function generateHtmlPage(payment) {
    const html =
        payment.status !== 'error'
            ? `
	  <!DOCTYPE html>
	  <html dir='rtl' >
		 <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
			<title>${payment.pageTitle}</title>
		 </head>
		 <body style='width:100%;height:100vh;background-color:#eee;display:flex;align-items:center;justify-content:center;overflow:hidden' >
		 <div style="text-align:center;font-family:serif tahoma;font-size:18px;width:330px; height:420px; border:1px solid #ddd;margin:auto;border-radius:4px;box-shadow:1px 1px 2px 5px #ddd2;background-color:#f4f4f4;overflow:auto;max-width:100%;max-height:100vh" >
			<h1 style="color:#33e83a">${payment.pageTitle}</h1>
			<div style='display:flex;align-items:center;justify-content:center;width:100%;gap:3px'><big>نام: </big> <p style='color:#777;' >${payment.username}</p></div>
			<div style='display:flex;align-items:center;justify-content:center;width:100%;gap:3px'><big>ایمیل: </big> <p style='color:#777;' >${payment.email}</p></div>
			<div style='display:flex;align-items:center;justify-content:center;width:100%;gap:3px'><big>عنوان محصول: </big> <p style='color:#777;' >${payment.title}</p></div>
			<div style='display:flex;align-items:center;justify-content:center;width:100%;gap:3px'><big>قیمت: </big> <p style='color:#777;' >${payment.price}</p></div>
			<div style='display:flex;align-items:center;justify-content:center;width:100%;gap:3px'><big>کد پیگیری: </big> <p style='color:#777;' >${payment.RefID}</p></div>
            <div style='height:6px'></div>
            <a href='${payment.location}' style='border:1px solid #09b; border-radius:4px; padding:2px;padding-inline:5px; color: #09b; cursor:pointer;font-size:13px;text-decoration:none'>بازگشت به دوره</Button>
		 </div>
		 </body>
	  </html>`
            : `<!DOCTYPE html>
	  <html>
		 <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
			<title>${payment.pageTitle}</title>
		 </head>
		 <body>
			<h1 style="color:red;text-align:center;margin-top:2rem" >${payment.pageTitle}</h1>
			<h2 style="color:#444;text-align:center;margin-top:10px" >${payment.h2}</h2>
		 </body>
	  </html>`;
    return html;
}


