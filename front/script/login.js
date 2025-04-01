import {checkToken, displayError} from "./auth_utils.js";

checkToken();

const loginForm = document.getElementById('login-form');
const errorElem = document.getElementById('error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }
    const {api_url} = JSON.parse(localStorage.getItem('config') || '{}');
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
        displayError(errorElem, resData.error);
        alert("Login failed");
    }
})