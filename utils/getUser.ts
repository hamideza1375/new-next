import { NextRequest } from "next/server";


/**
 * @export
   @param {import("next/server").NextRequest} req
 * @returns {{email: string; sellerId: string; username: string; userId: string; password: string; products: object[]; isAdmin: boolean}} 
 */
export default function getUser(req: NextRequest) {
    return JSON.parse(req.headers.get('user') ||'{}');
}
