import { decode } from "jsonwebtoken";


export default async function authSellerClient(req) {
    const user = decode(req.cookies.get('token')?.value, 'token');
    if (!user?.sellerId) return { error: true };
    else return {ok:true}
}
