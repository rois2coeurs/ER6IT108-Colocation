import {ApiClient} from "../script/api_client.js"; // template API
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
if (!id) window.location.href = 'index.html';
const api = new ApiClient(); // template API
const membersList = document.getElementById('members-list');
const houseShare = await (await api.get(`/house-share/${id}`)).json(); // template API
let isExpanded = false;
const toggleMembers = document.getElementById('toggle-members');

let isPurchasesExpanded = false;
const togglePurchases = document.getElementById('toggle-purchases');
const purchasesList = document.getElementById('purchases-list');

async function loadData(id) {
    const res = await api.get(`/house-share/${id}`); // template API

    if (!res.ok) {
        window.location.href = 'house_share_index.html';
        return;
    }

    const data = await res.json();

    const houseShareNameElement = document.getElementById('house-share-name');
    if (houseShareNameElement) {
        houseShareNameElement.textContent = data.name;
    }

    // Set user email
    const userEmail = JSON.parse(localStorage.getItem('user')).mail;
    document.getElementById('profile-email').textContent = userEmail;

    loadMembers();
    loadPurchases();
}

async function loadMembers() {
    try {
        const response = await api.get(`/house-share/${houseShare.id}/members`);
        const members = await response.json();

        displayMembers(members, isExpanded);
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

function displayMembers(members, showAll) {
    membersList.innerHTML = '';
    const displayLimit = showAll ? members.length : 5;

    const membersToShow = members.slice(0, displayLimit);
    if (membersToShow.length === 0) {
        membersList.innerHTML = '<p>Aucun membre trouvé.</p>';
        return;
    }

    membersToShow.forEach(members => {
        const membersElement = document.createElement('p');
        membersElement.innerHTML = `- ${members.firstname} ${members.name} ${members.mail} ${members.phone_number}`;
        membersList.appendChild(membersElement);
    });

    // Update toggle button text
    toggleMembers.textContent = showAll ? 'Voir moins' : 'Afficher tout';
}

async function loadPurchases() {
    try {
        const response = await api.get(`/house-share/${houseShare.id}/purchases`);
        const purchases = await response.json();

        displayPurchases(purchases, isPurchasesExpanded);
    } catch (error) {
        console.error('Error loading purchases:', error);
    }
}

function displayPurchases(purchases, showAll) {
    purchasesList.innerHTML = '';
    const displayLimit = showAll ? purchases.length : 5;

    const purchasesToShow = purchases.slice(0, displayLimit);
    if (purchasesToShow.length === 0) {
        purchasesList.innerHTML = '<p>Aucun achat trouvé.</p>';
        return;
    }

    purchasesToShow.forEach(purchase => {
        const purchaseElement = document.createElement('p');
        const date = new Date(purchase.date).toLocaleDateString('fr-FR');
        purchaseElement.innerHTML = `- ${purchase.title} ${purchase.amount}€ ${date} ${purchase.firstname} ${purchase.name}`;
        purchasesList.appendChild(purchaseElement);
    });

    // Update toggle button text
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