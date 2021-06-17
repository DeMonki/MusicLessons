export default function authHeader() {
    let token = localStorage.getItem('token');
    if(token) {
        return {'Content-Type': 'application/json', 'authorization': 'Bearer ' + token }
    }else 
    return {};
}