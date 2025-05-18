'use server';

import { createComment } from '@/services/apis/products';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

interface Data {
    [key: string]: any;
}

const cookieStore = await cookies();


/**
 * @example const example = async (value: any) => {
 const {status, data} = await interceptorsResponse(handelSendComment('params.id', { star: 'rating', ...value }));
 status <= 201 && '...'
 };
 */
export const handelSendComment = async (id: string, data: Data): Promise<any> => {
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('userId')?.value;
    
    if (!token || !userId) {
        throw new Error('برای ارسال نظر ابتدا وارد حساب خود شوید');
    }

    const res = await createComment(id, data, token, userId);
    revalidateTag(`comments-${id}`);
    return res;
};