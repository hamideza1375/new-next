'use client'

// تابع getCookie برای دریافت مقدار یک کوکی با نام مشخص
export default function getCookie(name) {
	// مقدار کوکی‌ها را به صورت یک رشته دریافت می‌کند
	const value = `; ${document.cookie}`;
	// کوکی‌ها را بر اساس نام مشخص شده جدا می‌کند
	const parts = value.split(`; ${name}=`);
	// اگر کوکی مورد نظر پیدا شد، مقدار آن را برمی‌گرداند
	if (parts.length === 2) return parts.pop().split(';').shift();
}
