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
        membersList.innerHTML = '<p>Erreur lors du chargement des membres.</p>';
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

    membersToShow.forEach(member => {
        const memberElement = document.createElement('p');
        memberElement.innerHTML = `- ${member.firstname} ${member.name} ${member.mail} ${member.phone_number}`;
        membersList.appendChild(memberElement);
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
        purchasesList.innerHTML = '<p>Erreur lors du chargement des achats.</p>';
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