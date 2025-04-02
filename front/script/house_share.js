import {ApiClient} from "../script/api_client.js"; // template API
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
if (!id) window.location.href = 'index.html';
const api = new ApiClient(); // template API

async function loadData(id) {
    const res = await api.get(`/house-share/${id}`); // template API

    if (!res.ok) {
        window.location.href = 'house_share_index.html';
        return;
    }

    const data = await res.json();

    console.log(data);

    const houseShareNameElement = document.getElementById('house-share-name');
    if (houseShareNameElement) {
        houseShareNameElement.textContent = data.name;
    }

    // Set user email
    const userEmail = JSON.parse(localStorage.getItem('user')).mail;
    document.getElementById('profile-email').textContent = userEmail;
}

loadData(id);