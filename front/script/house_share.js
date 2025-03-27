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
}

loadData(id);