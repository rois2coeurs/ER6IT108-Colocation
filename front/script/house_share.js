const url = new URL(window.location.href);
const id = url.searchParams.get('id');

if (!id) window.location.href = 'index.html';

async function loadData(id) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`/house-share/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        window.location.href = 'house_share_index.html';
        return;
    }

    const data = await res.json();

    console.log(data);
}


loadData(id);