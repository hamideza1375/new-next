// قسمت های کد به غیر از import ها , export هارو به زبان فارسی کامنت گذاری کن
'use client'
import { useState, useEffect } from 'react';

export default function useCookie(name, time) {
    const [cookie, setCookie] = useState(null); // برای ذخیره کوکی state تعریف

    useEffect(() => {
        const value = `; ${document.cookie}`; // document دریافت کوکی ها از
        const parts = value.split(`; ${name}=`); // جدا کردن کوکی مورد نظر
        if (parts.length === 2) setCookie(parts.pop().split(';').shift()); // state تنظیم مقدار کوکی در
    }, [name, time]); // وابستگی به نام و زمان

    return cookie; // بازگرداندن مقدار کوکی
}
