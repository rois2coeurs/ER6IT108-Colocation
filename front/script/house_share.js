import {ApiClient} from "../script/api_client.js";
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
if (!id) window.location.href = 'index.html';
const api = new ApiClient();
const membersList = document.getElementById('members-list');
const purchasesList = document.getElementById('purchases-list');

let isExpanded = false;
const toggleMembers = document.getElementById('toggle-members');

let isPurchasesExpanded = false;
const togglePurchases = document.getElementById('toggle-purchases');

async function loadData(id) {
    const res = await api.get(`/house-share/${id}`);

    if (!res.ok) {
        window.location.href = 'house_share_index.html';
        return;
    }

    const data = await res.json();

    const houseShareNameElement = document.getElementById('house-share-name');
    if (houseShareNameElement) {
        houseShareNameElement.textContent = data.name;
    }

    const userEmail = JSON.parse(localStorage.getItem('user')).mail;
    document.getElementById('profile-email').textContent = userEmail;

    await loadMembers();
    await loadPurchases();
}

async function loadMembers() {
    try {
        const response = await api.get(`/house-share/${id}/members`);
        const members = await response.json();

        displayMembers(members, isExpanded);
    } catch (error) {
        console.error('Error loading members:', error);
        membersList.innerHTML = '<tr><td colspan="4">Erreur lors du chargement des membres.</td></tr>';
    }
}

function displayMembers(members, showAll) {
    membersList.innerHTML = '';
    const displayLimit = showAll ? members.length : 5;

    const membersToShow = members.slice(0, displayLimit);
    if (membersToShow.length === 0) {
        membersList.innerHTML = '<tr><td colspan="4">Aucun membre trouvé.</td></tr>';
        return;
    }

    membersToShow.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.firstname}</td>
            <td>${member.name}</td>
            <td>${member.mail}</td>
            <td>${member.phone_number}</td>
        `;
        membersList.appendChild(row);
    });

    toggleMembers.textContent = showAll ? 'Voir moins' : 'Afficher tout';
}

async function loadPurchases() {
    try {
        const response = await api.get(`/house-share/${id}/purchases`);
        if (!response.ok) {
            throw new Error('Failed to load purchases');
        }
        const purchases = await response.json();
        displayPurchases(purchases, isPurchasesExpanded);
    } catch (error) {
        console.error('Error loading purchases:', error);
        purchasesList.innerHTML = '<tr><td colspan="5">Erreur lors du chargement des achats.</td></tr>';
    }
}

function displayPurchases(purchases, showAll) {
    purchasesList.innerHTML = '';
    const displayLimit = showAll ? purchases.length : 5;

    const purchasesToShow = purchases.slice(0, displayLimit);
    if (purchasesToShow.length === 0) {
        purchasesList.innerHTML = '<tr><td colspan="5">Aucun achat trouvé.</td></tr>';
        return;
    }

    purchasesToShow.forEach(purchase => {
        const row = document.createElement('tr');
        const date = new Date(purchase.date).toLocaleDateString('fr-FR');
        row.innerHTML = `
            <td>${purchase.title}</td>
            <td class="amount">${purchase.amount}€</td>
            <td>${date}</td>
            <td>${purchase.firstname}</td>
            <td>${purchase.name}</td>
        `;
        purchasesList.appendChild(row);
    });

    togglePurchases.textContent = showAll ? 'Voir moins' : 'Afficher tout';
}

toggleMembers.addEventListener('click', () => {
    isExpanded = !isExpanded;
    loadMembers();
});

togglePurchases.addEventListener('click', () => {
    isPurchasesExpanded = !isPurchasesExpanded;
    loadPurchases();
});

loadData(id);