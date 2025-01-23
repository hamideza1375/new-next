import { NextResponse } from 'next/server';
import { _userAgent } from './middleware/_userAgent';
import authMainAdmin from './middleware/authMainAdmin';
import authMainAdminClient from './middleware/authMainAdminClient';
import authSignClient from './middleware/authSignClient';
import authUser from './middleware/authUser';
import authUserClient from './middleware/authUserClient';
import { preventInvalidPhotos } from './middleware/preventInvalidPhotos';
import authSellerClient from './middleware/authSellerClient';
import block from './middleware/block';
import authProducts from './middleware/authProducts';


export async function middleware(req) {
    try {
    const response = NextResponse.next();
    
    await block(req);

    // بررسی userAgent
     if(_userAgent(req)){
        return new Response(
            new Blob(['<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><title>boot</title></head><body dir="rtl" style="height:100vh;width:100vw;background-color:#0a0010; overflow:hidden; display:flex; flex-direction:column; align-items: center " ><h2 style="text-align:center; margin-inline:auto;color:#a22; margin-top:30px" >اگر فیلتر شکن شما روشن هست آن را خاموش کنید</h2></body></html>']),
            {headers: { 'Content-Type': 'text/html; charset=utf-8' }}
        )
     }
     // بررسی حجم تصویر
     if(await preventInvalidPhotos(req) === 'MAX_LENGTH') return NextResponse.json('حجم تصویر نباید بزرگ تر از ۲ مگابایت باشد',{status:400})
    
    // بررسی مسیرهای مختلف و اعمال احراز هویت
    if (req.nextUrl.pathname.startsWith('/api/dashboard')) {
        await authMainAdmin(req, NextResponse, response);
        return response;
    } else if (req.nextUrl.pathname.startsWith('/api/profile')) {
        await authUser(req, NextResponse, response);
        return response;
    } 
    else if (req.nextUrl.pathname.startsWith('/api/seller')) {
        await authUser(req, NextResponse, response);
        return response;
    } 
    else if (req.nextUrl.pathname.startsWith('/api/products')) {
        await authProducts(req, NextResponse, response);
        return response;
    }
    //
    else if (req.nextUrl.pathname.startsWith('/dashboard')) {
        const { error } = await authMainAdminClient(req, NextResponse, response);
        if (error) return NextResponse.redirect(new URL('/notfound', req.url));
        return response;
    } 
    else if (req.nextUrl.pathname.startsWith('/profile')) {
        const { error } = await authUserClient(req, NextResponse, response);
        if (error) return NextResponse.redirect(new URL('/sign', req.url));
        return response;
    } 
    else if (req.nextUrl.pathname.startsWith('/seller')) {
        const { error } = await authSellerClient(req, NextResponse, response);
        if (error) return NextResponse.rewrite(new URL('/notfound', req.url));
        return response;
    } 
    else if (req.nextUrl.pathname.startsWith('/sign')) {
        const { error } = await authSignClient(req, NextResponse, response);
        if (error) return NextResponse.redirect(new URL('/profile', req.url));
        return response;
    }
} catch (error) {
    return new Response(error?.message || 'خطای سرور', { status: (error && error.status) || 500 });
}
}
