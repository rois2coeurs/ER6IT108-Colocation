const createColocationForm = document.getElementById('create-colocation-form');

createColocationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
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
        console.error('Error creating colocation:', error);
        alert('Une erreur est survenue lors de la création de la colocation');
    }
});

function fetchInvitations() {
}

function displayInvitations(invitations) {
    if (!invitations || invitations.length === 0) {
        invitationContainer.innerHTML = '<p>Aucune invitation en attente</p>';
        return;
    }

    let invitationsHTML = '';

    invitations.forEach(invitation => {
        invitationsHTML += `
            <div class="invitation-item" data-id="${invitation.id}">
                <div class="invitation-text">
                    Invitation à rejoindre "${invitation.colocation_name}" à ${invitation.colocation_address}
                </div>
                <div class="invitation-actions">
                    <button class="accept-invite" onclick="handleInvitation(${invitation.id}, 'accept')">✓</button>
                    <button class="decline-invite" onclick="handleInvitation(${invitation.id}, 'decline')">✗</button>
                </div>
            </div>
            <hr>
        `;
    });

    invitationContainer.innerHTML = invitationsHTML;
}
