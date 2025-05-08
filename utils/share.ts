import { toast } from "react-toastify";
 

interface shareParam {
	title: string,
	text: string,
	url: string,
}


export const share =async(shareData: shareParam)=>{
	try {
		if(!navigator.canShare) return toast.error('مرورگر شما از این قابلیت پشتیبانی نمیکند')
		await navigator.share(shareData);
	 } catch (err) {
		toast.error('خطا، اشتراک گذاری صورت نگرفت')
	 }
}