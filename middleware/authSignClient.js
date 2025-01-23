
export default async function authSignClient(req) {
    if (req.cookies.get('token')) return {error:true}
    else return {ok:true}
}
