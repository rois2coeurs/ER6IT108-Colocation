import {ApiClient} from "../script/api_client.js";

const api = new ApiClient();

const transferForm = document.getElementById('transfer-form');
const transferFormError = document.getElementById('transfer-error');
transferForm.addEventListener('submit', async (e) => {
    await submitTransfer(e);
})

loadHistory();

async function submitTransfer(event) {
    event.preventDefault();

    const formData = new FormData(transferForm);
    const data = Object.fromEntries(formData.entries());

    const id = JSON.parse(localStorage.getItem('user')).id;

    const res = await api.post(`/transfer/${id}`, data);

    if (!res.ok) {
        const error = await res.json();
        transferFormError.innerText = '⚠️ ' + error.error;
        transferFormError.style.display = 'block';
        return;
    }

    alert('Transfer submitted successfully');
    transferForm.reset();
    await loadHistory();
}

async function loadHistory() {
    const id = JSON.parse(localStorage.getItem('user')).id;
    if (!id) window.location.href = 'index.html';

    const res = await api.get(`/transfer/${id}`);
    if (!res.ok) alert('Error loading transfer history');

    const data = await res.json();
    data.reverse(); // Reverse the order of the data to show the most recent transfers first

    const tableBody = document.getElementById('transfer-history');

    tableBody.innerHTML = ''; // Clear existing rows


    data.forEach(item => {
        const row = createRow(item);
        tableBody.appendChild(row);
    });
}

function createRow(data) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.firstname[0]}. ${data.name}</td>
        <td class="end"><span class="bubble">${data.is_sender === true ? "Envoyé" : "Reçu"}</span></td>
        <td class="end">${data.amount}€</td>
    `;
    return row;
}