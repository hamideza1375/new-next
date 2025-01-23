import { useEffect, useRef } from 'react';

let start; // متغیری برای پیگیری شروع تایمر
export function useDebounceEffect(delayCall, value, delay) {
    const delayRef = useRef(delay); // برای ذخیره مقدار تاخیر useRef استفاده از
    const delayCallRef = useRef(delayCall); // برای ذخیره تابع تاخیر useRef استفاده از

    useEffect(() => {
        delayRef.current = delay; // به‌روزرسانی مقدار تاخیر
        delayCallRef.current = delayCall; // به‌روزرسانی تابع تاخیر
    }, [delay, delayCall]);

    useEffect(() => {
        const handler = start &&
            setTimeout(() => {
                delayCallRef.current(); // اجرای تابع تاخیر پس از مدت زمان مشخص
            }, delayRef.current);
        start = true; // تنظیم شروع تایمر
        return () => {
            if(handler) clearTimeout(handler); // پاک کردن تایمر در صورت تغییر مقدار
        };
    }, [value]);
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