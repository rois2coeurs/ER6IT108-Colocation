document.addEventListener('DOMContentLoaded', async () => {
    const createColocationForm = document.getElementById('create-colocation-form');
    const houseSharesList = document.getElementById('house-shares-list');
    const userEmailElement = document.getElementById('user-email');
    
    await redirectIfHasHouseShare();
    await loadHouseShares();
    displayUserEmail();
    
    createColocationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createColocation(e.target);
    });
});

function displayUserEmail() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const userEmailElement = document.getElementById('user-email');
    userEmailElement.textContent = 'placeholder de l email';
}

async function loadHouseShares() {
    const token = localStorage.getItem('token');
    const houseSharesList = document.getElementById('house-shares-list');
    
    try {
        const response = await fetch('/house-share', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des colocations');
        }
        
        const houseShares = await response.json();
        
        if (houseShares.length === 0) {
            houseSharesList.innerHTML = '<p>Aucune invitation disponible</p>';
            return;
        }
        
        let html = '<ul class="house-shares-list">';
        houseShares.forEach(house => {
            html += `
                <li class="house-share-item">
                    <div class="house-share-info">
                        <strong>${house.name}</strong>
                        <p>${house.address}</p>
                    </div>
                    <button class="join-button" data-id="${house.id}">Rejoindre</button>
                </li>
                <hr>
            `;
        });
        html += '</ul>';
        houseSharesList.innerHTML = html;
        document.querySelectorAll('.join-button').forEach(button => {
            button.addEventListener('click', async () => {
                await joinHouseShare(button.dataset.id);
            });
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        houseSharesList.innerHTML = `<p>Erreur lors du chargement des colocations: ${error.message}</p>`;
    }
}

async function createColocation(form) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Veuillez vous connecter pour créer une colocation');
        return;
    }
    
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        address: formData.get('address')
    };
    
    try {
        const response = await fetch('/house-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la création de la colocation');
        }
        
        const result = await response.json();
        alert('Colocation créée avec succès!');
        form.reset();
        window.location.href = `house_share.html?id=${result.id}`;
        
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
    
    try {
        const response = await fetch('/me/house-share', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            // L'utilisateur n'a pas de colocation, on reste sur cette page
            return;
        }
        
        const data = await response.json();
        if (data.houseShareId) {
            window.location.href = `house_share.html?id=${data.houseShareId}`;
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de colocation:', error);
    }
}