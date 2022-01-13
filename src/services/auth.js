
const auth = () => {
    const token = localStorage.getItem('token');
    return token;
}

export default auth;
