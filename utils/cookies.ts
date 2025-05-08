'use client'

export function setCookie(name: string, value: any, seconds: number) {
	const date = new Date();
	date.setTime(date.getTime() + (seconds * 1000));
	const expires = "expires=" + date.toUTCString();
	const sameSite = "SameSite=None; Secure"; // اضافه کردن SameSite=None به کوکی
	document.cookie = name + "=" + value + ";" + expires + ";path=/;" + sameSite;
}


export function getCookie(name: string) {
	const value = `; ${document.cookie}`;
	const parts: Array<any> = value.split(`; ${name}=`);
	if (parts.length && parts.length === 2) return parts.pop().split(';').shift();
 }


 export function deleteCookie(name: string) {
	document.cookie = name + '=; Max-Age=-99999999;';
}


