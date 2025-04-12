// It will be available as randomEntry() (camelCase of file name without extension)
export default function () {
    const userData = localStorage.getItem('user');
    if (!userData) throw new Error('User data not found in localStorage');
    const user = JSON.parse(userData);
    if (!user) throw new Error('User data is not valid JSON');
    return user.id;
}
