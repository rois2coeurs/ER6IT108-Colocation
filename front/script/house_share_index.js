import {ApiClient} from "./api_client.js";
const api = new ApiClient();

const createColocationForm = document.getElementById('create-colocation-form');
const houseSharesList = document.getElementById('house-shares-list');
const userEmailElement = document.getElementById('user-email');
    
await redirectIfHasHouseShare();
await loadHouseShares();
displayUserEmail();
    
createColocationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createHouseShare(e.target);
});


async function displayUserEmail() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Veuillez vous connecter pour créer une colocation');
        return;
    }

    const formData = new FormData(createColocationForm);
    const data = {
        name: formData.get('name'),
        address: formData.get('address')
    };
    
    try {
        const res = await fetch('http://localhost:8090/house-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const resData = await res.json();

        if (res.ok) {
            alert('Colocation créée avec succès!');
            createColocationForm.reset();
        } else {
            alert(`Erreur: ${resData.error || 'Une erreur est survenue'}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert(`Erreur: ${error.message}`);
    }
}

async function createHouseShare(houseId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Veuillez vous connecter pour rejoindre une colocation');
        return;
    }
    
    try {
        const response = await api.get(`/house-share/${houseId}`)
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la tentative de création de la colocation');
        }
        alert('Vous avez créée la colocation avec succès!');
        window.location.href = `house_share.html?id=${houseId}`;
        
    } catch (error) {
        console.error('Erreur:', error);
        alert(`Erreur: ${error.message}`);
    }
}

async function joinHouseShare(houseId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Veuillez vous connecter pour rejoindre une colocation');
        return;
    }
    
    try {
        const response = await fetch(`/house-share/${houseId}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({}) // Pas besoin d'envoyer l'email car nous utilisons l'utilisateur authentifié
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la tentative de rejoindre la colocation');
        }
        alert('Vous avez rejoint la colocation avec succès!');
        window.location.href = `house_share.html?id=${houseId}`;
        
    } catch (error) {
        console.error('Erreur:', error);
        alert(`Erreur: ${error.message}`);
    }
}

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
        window.location.href = 'house_share.html?id=' + resData.houseShareId;
    }
}

redirectIfHasHouseShare();