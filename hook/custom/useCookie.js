/**
 * یک هوک ری‌اکت برای دریافت مقدار کوکی بر اساس نام آن
 * 
 * @module useCookie
 * @param {string} name - نام کوکی مورد نظر برای دریافت مقدار
 * @param {number} [time] - زمان اختیاری برای بررسی مجدد کوکی در صورت تغییر (مثلاً برای انقضا)
 * @returns {string|null} مقدار کوکی در صورت وجود، در غیر این صورت null برگردانده می‌شود
 * @example
 * // دریافت کوکی
 * const sessionId = useCookie('sessionId');
 * 
 * // دریافت کوکی با بررسی مجدد بر اساس زمان
 * const sessionId = useCookie('sessionId', Date.now());
 */
'use client'
import { useState, useEffect } from 'react';

/**
 * هوک سفارشی برای مدیریت کوکی‌ها
 * @param {string} name - نام کوکی
 * @param {number} [time] - زمان وابستگی برای بررسی مجدد
 * @returns {string|null} مقدار کوکی یا null
 */
export default function useCookie(name, time) {
    // تعریف state برای ذخیره مقدار کوکی
    const [cookie, setCookie] = useState(null);

    // اثر جانبی برای خواندن کوکی از document
    useEffect(() => {
        // دریافت تمام کوکی‌ها به صورت رشته
        const value = `; ${document.cookie}`;
        
        // جدا کردن کوکی مورد نظر از سایر کوکی‌ها
        const parts = value.split(`; ${name}=`);
        
        // اگر کوکی وجود داشت، مقدار آن را استخراج و در state قرار می‌دهیم
        if (parts.length === 2) {
            setCookie(parts.pop().split(';').shift());
        }
    }, [name, time]); // وابستگی‌های هوک (در صورت تغییر نام یا زمان، اثر اجرا می‌شود)

    // برگرداندن مقدار کوکی
    return cookie;
}