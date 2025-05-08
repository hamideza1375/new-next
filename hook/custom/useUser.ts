'use client'; // مشخص می‌کند این کد فقط در سمت کلاینت اجرا شود

import { decode, JwtPayload } from 'jsonwebtoken'; // برای دیکد کردن توکن JWT
import { useEffect, useState } from 'react'; // هوک‌های پایه ری‌اکت

/**
 * هوک سفارشی برای دریافت و دیکد کردن اطلاعات کاربر از کوکی
 * @param {string} name - نام کوکی حاوی توکن کاربر
 * @returns {JwtPayload | null} اطلاعات دیکد شده کاربر یا null در صورت عدم وجود
 * @example
 * // نمونه استفاده
 * const user = useUser('auth_token');
 * console.log(user?.username);
 */
export default function useUser(name: string): JwtPayload | null {
    // تعریف state برای نگهداری اطلاعات کاربر
    const [user, setUser] = useState<JwtPayload | null>(null);

    /**
     * اثر جانبی برای خواندن و پردازش کوکی
     */
    useEffect(() => {
        // بررسی وجود document (برای اطمینان از اجرا در محیط مرورگر)
        if (typeof document === 'undefined') return;

        try {
            // خواندن تمام کوکی‌ها با اضافه کردن پیشوند ; برای جستجوی آسانتر
            const value = `; ${document.cookie}`;
            
            // جدا کردن کوکی مورد نظر از سایر کوکی‌ها
            const parts = value.split(`; ${name}=`);
            
            // اگر کوکی وجود داشت
            if (parts.length === 2) {
                // استخراج مقدار کوکی و دیکد کردن آن
                const token = parts.pop()?.split(';').shift();
                if (token) {
                    const decoded = decode(token) as JwtPayload;
                    setUser(decoded); // ذخیره اطلاعات کاربر در state
                }
            }
        } catch (error) {
            console.error('Error decoding user token:', error);
            setUser(null);
        }
    }, [name]); // وابستگی به نام کوکی

    // بازگرداندن اطلاعات کاربر
    return user;
}