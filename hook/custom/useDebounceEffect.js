import { useEffect, useRef } from 'react';

let start; // متغیر سراسری برای پیگیری اولین اجرای تایمر

/**
 * هوک سفارشی برای ایجاد تاخیر در اجرای اثرات (debounce)
 * @module useDebounceEffect
 * @param {Function} delayCall - تابعی که پس از تاخیر باید اجرا شود
 * @param {any} reEffect - مقداری که تغییر آن باعث فعال شدن تاخیر می‌شود
 * @param {number} delay - مدت زمان تاخیر به میلی‌ثانیه
 * @example
 * // استفاده پایه
 * useDebounceEffect(() => {
 *   console.log('Value changed after delay:', searchValue);
 * }, searchValue, 500);
 */
export function useDebounceEffect(delayCall, reEffect, delay) {
    // ذخیره مقدار تاخیر با useRef برای حفظ مقدار بین رندرها
    const delayRef = useRef(delay);
    
    // ذخیره تابع callback با useRef برای حفظ مقدار بین رندرها
    const delayCallRef = useRef(delayCall);

    // اثر جانبی برای به‌روزرسانی مقادیر ref هنگام تغییر delay یا delayCall
    useEffect(() => {
        delayRef.current = delay;
        delayCallRef.current = delayCall;
    }, [delay, delayCall]);

    // اثر جانبی اصلی برای پیاده‌سازی الگوی debounce
    useEffect(() => {
        // ایجاد تایمر فقط اگر این اولین بار نیست که هوک اجرا می‌شود
        const handler = start && setTimeout(() => {
            delayCallRef.current(); // اجرای تابع callback پس از تاخیر
        }, delayRef.current);

        // علامت‌گذاری که هوک حداقل یک بار اجرا شده است
        start = true;

        // تابع cleanup برای پاک کردن تایمر در صورت تغییر reEffect قبل از اتمام تاخیر
        return () => {
            if (handler) clearTimeout(handler);
        };
    }, [reEffect]); // وابستگی به reEffect - با هر تغییر reEffect اثر فعال می‌شود
}




// import { useEffect } from 'react';
// // متغیر شروع
// let start
// export function useDebounceEffect(delayCall, value, delay) {
// 	// استفاده از useEffect برای اجرای تابع با تاخیر
// 	useEffect(() => {
// 		// تنظیم تایمر برای اجرای تابع با تاخیر
// 		const handler = start &&
// 			setTimeout(() => {
// 				delayCall()
// 			}, delay);
// 		// تنظیم متغیر شروع به true
// 		start = true
// 		// پاک کردن تایمر در صورت تغییر مقدار
// 		return () => {
// 			if(handler) clearTimeout(handler);
// 		};
// 	},
// 		// وابستگی به مقدار value
// 		[value]
// 	);

// }