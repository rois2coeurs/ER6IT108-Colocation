import {checkToken, displayError, checkPassword} from "./auth_utils.js";

checkToken();

const registerForm = document.getElementById('register-form');
const errorElem = document.getElementById('error');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const checkPasswordErrors = checkPassword(formData.get('password'), formData.get('password-double'));
    console.log(checkPasswordErrors);
    if (checkPasswordErrors.length > 0) {
        displayError(errorElem, checkPasswordErrors.join(', '));
        return;
    }
    const data = {
        email: formData.get('email'),
        name: formData.get('name'),
        first_name: formData.get('firstname'),
        phone_number: formData.get('phone_number'),
        password: formData.get('password')
    }
    const {api_url} = JSON.parse(localStorage.getItem('config') || '{}');
    const res = await fetch(`${api_url}/register`, {
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
    }
})

