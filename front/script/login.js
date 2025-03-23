const loginForm = document.getElementById('login-form');
const errorElem = document.getElementById('error');

async function checkToken() {
    const { api_url } = JSON.parse(localStorage.getItem('config') || '{}');
    if (localStorage.getItem('token') && api_url) {
        const res = await fetch(`${api_url}/validate`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!res.ok) {
            localStorage.removeItem('token');
        } else {
            window.location.href = "house_share.html";
        }
    }
}

checkToken();

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }
    const { api_url } = JSON.parse(localStorage.getItem('config') || '{}');
    const res = await fetch(`${api_url}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const resData = await res.json();
    console.log(resData);
    if (res.ok) {
        localStorage.setItem('token', resData.token);
        window.location.href = "house_share_index.html";
    } else {
        errorElem.innerText = resData.error;
        errorElem.style.display = 'block';
        alert("Login failed");
    }
})