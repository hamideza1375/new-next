import { cookies } from 'next/headers';

export async function POST(req) {
    const cookieStore = cookies();

    cookieStore.delete('token');
    cookieStore.delete('userId');

    return Response.json('', { status: 202 });
}
