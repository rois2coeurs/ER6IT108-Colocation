import {ApiClient} from "/front/script/api_client.js";
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
if (!id) window.location.href = 'index.html';
const api = new ApiClient();

async function loadData(id) {
    const res = await api.get(`/house-share/${id}`);

    if (!res.ok) {
        window.location.href = 'house_share_index.html';
        return;
    }

    const data = await res.json();

    console.log(data);
}

loadData(id);