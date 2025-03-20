async function checkLogin() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    const res = await fetch('/validate', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!res.ok) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

checkLogin();