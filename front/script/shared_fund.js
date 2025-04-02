import {ApiClient} from "../script/api_client.js";


const api = new ApiClient();
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
if (!id) {
    await redirectIfHasHouseShare();
}



const houseShare = await (await api.get(`/house-share/${id}`)).json(); // template API
const paymentsList = document.getElementById('payments-list');
const houseShareName = document.getElementById('house-share-name');
const togglePayments = document.getElementById('toggle-payments');
let isExpanded = false;
console.log(houseShare);


try {
    // Set user email
    const userEmail = localStorage.getItem('email');
    document.getElementById('profile-email').textContent = userEmail;

    // Get house share name and shared fund info
    const houseShareResponse = await api.get(`/house-share/${houseShare.id}/shared-fund`);
    const houseShareData = await houseShareResponse.json();
    houseShareName.textContent = houseShareData.name;

    // Get payments history
    await loadPayments();
} catch (error) {
    console.error('Error initializing page:', error);
}


async function loadPayments() {
    try {
        const response = await api.get(`/house-share/${houseShare.id}/shared-fund/payments`);
        const payments = await response.json();
        console.log(payments)
        
        displayPayments(payments, isExpanded);
    } catch (error) {
        console.error('Error loading payments:', error);
    }
}

function displayPayments(payments, showAll) {
    paymentsList.innerHTML = '';
    const displayLimit = showAll ? payments.length : 5;
    
    const paymentsToShow = payments.slice(0, displayLimit);
    if (paymentsToShow.length === 0) {
        paymentsList.innerHTML = '<p>Aucun paiement trouvé.</p>';
        return;
    }
    console.log(paymentsToShow)
    
    paymentsToShow.forEach(payment => {
        const date = new Date(payment.date).toLocaleDateString('fr-FR');
        const paymentElement = document.createElement('p');
        paymentElement.innerHTML = `- ${payment.firstname} ${payment.name} ${date} <b>${payment.amount} €</b>`;
        paymentsList.appendChild(paymentElement);
    });

    // Update toggle button text
    togglePayments.textContent = showAll ? 'Voir moins' : 'Afficher tout';
}

// Event Listeners
togglePayments.addEventListener('click', () => {
    isExpanded = !isExpanded;
    loadPayments();
});

async function redirectIfHasHouseShare() {
    const token = localStorage.getItem('token');

    if (!token) return;

    const res = await fetch('/me/house-share', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const resData = await res.json();
    if (res.ok && resData.houseShareId) {
        window.location.href = 'shared_fund.html?id=' + resData.houseShareId;
    }
    console.log(resData.houseShareId);
}

