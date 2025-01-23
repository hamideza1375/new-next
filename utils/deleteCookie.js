'use client'

// این تابع کوکی با نام مشخص شده را حذف می‌کند
export function deleteCookie(name) {
	// تنظیم کوکی با زمان انقضای منفی برای حذف آن
	document.cookie = name + '=; Max-Age=-99999999;';
}
