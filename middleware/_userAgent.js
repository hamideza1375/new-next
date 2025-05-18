import { userAgent } from 'next/server';

/**
 * این تابع درخواست را بررسی می‌کند تا ببیند آیا از یک ربات است یا از ایران نیست
 * @param {import('next/server').NextRequest} request - درخواست ورودی
 * @returns {boolean} - // برمی‌گرداند true اگر درخواست از یک ربات باشد یا از ایران نباشد، مقدار
 */
export async function _userAgent(request) {
   return new Promise((resolve, reject) => {
      const { isBot } = userAgent(request);
      if (!isBot) reject({message:'شما اجازه ی دسترسی ندارید', status: 403})
      else resolve('')
   });
}
