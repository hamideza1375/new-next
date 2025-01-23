'use client'; // استفاده از حالت کلاینت
import { decode } from 'jsonwebtoken'; // jsonwebtoken از کتابخانه decode وارد کردن تابع
import { useEffect, useState } from 'react'; // از ری‌اکت useState و useEffect وارد کردن توابع

export default function useUser(name) {
    const [user, setUser] = useState(); // تعریف state برای ذخیره اطلاعات کاربر
    useEffect(() => {
        const value = `; ${document.cookie}`; // دریافت کوکی‌ها از مرورگر
        const parts = value.split(`; ${name}=`); // جدا کردن کوکی مورد نظر با استفاده از نام
        if (parts.length === 2) setUser(decode(parts.pop().split(';').shift(), 'token')); // ذخیره می‌کنیم state کرده و در decode اگر کوکی پیدا شد، آن را
    }, [name]); // زمانی که نام تغییر کند useEffect اجرای

    return user; // بازگرداندن اطلاعات کاربر
}
