'use client'

// تابعی برای تنظیم کوکی با نام، مقدار و زمان انقضا بر حسب ثانیه
export function setCookie(name, value, seconds) {
	// ایجاد یک تاریخ جدید
	const date = new Date();
	// تنظیم زمان انقضا برای کوکی
	date.setTime(date.getTime() + (seconds * 1000));
	// تبدیل زمان انقضا به رشته‌ای قابل استفاده در کوکی
	const expires = "expires=" + date.toUTCString();
	// به کوکی برای امنیت بیشتر SameSite=None اضافه کردن
	const sameSite = "SameSite=None; Secure"; 
	// تنظیم کوکی با نام، مقدار، زمان انقضا و مسیر
	document.cookie = name + "=" + value + ";" + expires + ";path=/;" + sameSite;
}