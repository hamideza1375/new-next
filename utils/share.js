import { toast } from "react-toastify";
 
export const share =async(shareData)=>{
	try {
		if(!navigator.canShare) return toast.error('مرورگر شما از این قابلیت پشتیبانی نمیکند')
		await navigator.share(shareData);
	 } catch {
		toast.error('خطا، اشتراک گذاری صورت نگرفت')
	 }
}