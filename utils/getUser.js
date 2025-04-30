

/**
 * @export
   @param {import("next/server").NextRequest} req
 * @returns {{email: string; sellerId: string; username: string; userId: string; password: string; products: object[];}} 
 */
export default function getUser(req) {
    return JSON.parse(req.headers.get('user') ||'{}');
}
