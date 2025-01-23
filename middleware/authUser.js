import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';


export default async function authUser(req, res, next) {
    return new Promise((resolve, reject)=>{
        const cookieStore = cookies();
        // دریافت توکن کاربر از کوکی‌ها
        const user = decode(cookieStore.get('token')?.value, { complete: true });
        const httpUser = decode(cookieStore.get('httpToken')?.value, { complete: true });
        
        // بررسی اینکه آیا توکن httpUser وجود دارد یا خیر
        if (!httpUser) return reject({ message: 'ابتدا وارد حسابتان شوید' , status: 401 });
        
        // بررسی اینکه آیا توکن user وجود دارد یا خیر
        if (!user) return reject({ message: 'ابتدا وارد حسابتان شوید' , status: 401 });
        
        // بررسی اینکه ایمیل‌های توکن‌ها با هم مطابقت دارند یا خیر
        if (user.payload.email !== httpUser.payload.email) return reject({ message: 'شما دسترسی مجاز را ندارید' , status: 403 });
        
        // بررسی اینکه آیا یکی از توکن‌ها ادمین است و دیگری نیست
        if ((user.payload.isAdmin || httpUser.payload.isAdmin) && user.payload.isAdmin !== httpUser.payload.isAdmin) return reject({ message: 'شما دسترسی مجاز را ندارید' , status: 403 });
        
        // بررسی اینکه آیا ایمیل‌های توکن‌های ادمین با هم مطابقت دارند یا خیر
        if ((user.payload.isAdmin || httpUser.payload.isAdmin) && user.payload.email !== httpUser.payload.email) return reject({ message: 'شما دسترسی مجاز را ندارید' , status: 403 });
        
        // بررسی اینکه آیا توکن user ادمین است و توکن httpUser ادمین نیست
        if (user.payload.isAdmin && !httpUser.payload.isAdmin) return reject({ message: 'شما دسترسی مجاز را ندارید' , status: 403 });
        
        // تنظیم هدر user با اطلاعات توکن httpUser
        next.headers.set('user', JSON.stringify(httpUser.payload));
        resolve()
    })
}
