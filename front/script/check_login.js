import {ApiClient} from "/front/script/api_client.js";

const api = new ApiClient();

async function checkLogin() {
    const res = await api.get("/validate");
    console.log(res);
    if (!res.ok) {
        console.log("Token invalid");
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

checkLogin();