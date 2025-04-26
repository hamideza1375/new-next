'use client'; // مشخص می‌کند این کد فقط در سمت کلاینت اجرا شود

import { decode } from 'jsonwebtoken'; // برای دیکد کردن توکن JWT
import { useEffect, useState } from 'react'; // هوک‌های پایه ری‌اکت

/**
 * هوک سفارشی برای دریافت و دیکد کردن اطلاعات کاربر از کوکی
 * @module useUser
 * @param {string} name - نام کوکی حاوی توکن کاربر
 * @returns {Object|null} اطلاعات دیکد شده کاربر یا null در صورت عدم وجود
 * @example
 * // نمونه استفاده
 * const user = useUser('auth_token');
 * console.log(user.username);
 */
export default function useUser(name) {
    // تعریف state برای نگهداری اطلاعات کاربر
    const [user, setUser] = useState();

    /**
     * اثر جانبی برای خواندن و پردازش کوکی
     */
    useEffect(() => {
        // خواندن تمام کوکی‌ها با اضافه کردن پیشوند ; برای جستجوی آسانتر
        const value = `; ${document.cookie}`;
        
        // جدا کردن کوکی مورد نظر از سایر کوکی‌ها
        const parts = value.split(`; ${name}=`);
        
        // اگر کوکی وجود داشت
        if (parts.length === 2) {
            // استخراج مقدار کوکی و دیکد کردن آن
            const token = parts.pop().split(';').shift();
            setUser(decode(token, 'token')); // ذخیره اطلاعات کاربر در state
        }
    }, [name]); // وابستگی به نام کوکی

    // بازگرداندن اطلاعات کاربر
    return user;
}