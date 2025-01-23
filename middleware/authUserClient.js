
export default async function authUserClient(req) {
    if (req.cookies.get('token')?.value) return {ok:true} 
    else return {error:true}
}
