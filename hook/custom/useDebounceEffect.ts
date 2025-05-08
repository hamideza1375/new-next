import { useEffect } from 'react';
// متغیر شروع
let start: boolean = false;
/**
 * هوک سفارشی برای ایجاد تاخیر در اجرای اثرات (debounce)
 * @module useDebounceEffect
 * @param {Function} delayedCall - تابعی که پس از تاخیر باید اجرا شود
 * @param {string} searchValue - مقداری که تغییر آن باعث فعال شدن تاخیر می‌شود
 * @param {number} delay - مدت زمان تاخیر به میلی‌ثانیه
 * @example
 * // استفاده پایه
 * useDebounceEffect(() => {
 *   console.log('Value changed after delay:', searchValue);
 * }, searchValue, 500);
 */

export function useDebounceEffect(delayedCall: () => void, searchValue: string, delay: number) {
    // استفاده از useEffect برای اجرای تابع با تاخیر
    useEffect(() => {
        // تنظیم تایمر برای اجرای تابع با تاخیر
        const handler =
            start &&
            setTimeout(() => {
                delayedCall();
            }, delay);
        // تنظیم متغیر شروع به true
        start = true;
        // پاک کردن تایمر در صورت تغییر مقدار
        return () => {
            if (handler) clearTimeout(handler);
        };
    }, [searchValue]);
}
