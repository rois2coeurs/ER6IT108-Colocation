<template>
  <NuxtLayout title="Colocation">
    <Card
        title="Crée une colocation"
        icon="mdi-home-plus-outline"
        :on-button-click="postHouseShare"
        button-text="Crée la colocation"
    >
      <form id="create-house-share">
        <FormInput name="name" label="Nom de la colocation" required/>
        <FormInput name="address" label="Adresse" required/>
      </form>
    </Card>
    <Card title="Rejoindre une colocation" icon="mdi:history">
      <div class="tabs">
        <button :class="{'active': filterStatus === 'pending'}" @click="updateStatutOrClear('pending')">En attente
        </button>
        <button :class="{'active': filterStatus === 'accepted'}" @click="updateStatutOrClear('accepted')">Acceptée
        </button>
        <button :class="{'active': filterStatus === 'declined'}" @click="updateStatutOrClear('declined')">Rejetée
        </button>
        <button :class="{'active': filterStatus === 'cancelled'}" @click="updateStatutOrClear('cancelled')">Annulée
        </button>
      </div>
      <table class="table" v-if="filteredInviters.length > 0">
        <tbody>
        <tr v-for="invite in filteredInviters" :key="invite.id">
          <td>{{ invite.name }}</td>
          <td>{{ invite.address }}</td>
          <td :class="'invite-status-'+invite.status">{{ inviteStatusToFrench(invite.status) }}</td>
          <td v-if="invite.status == 'pending'" class="action-buttons">
            <button class="accept-button" @click="acceptInvite(invite.id)" title="Contacter">
              <Icon name="streamline:interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form"/>
            </button>
            <button class="reject-button" @click="cancelInvite(invite.id)" title="Annuler l'invitation"
                    v-if="invite.status === 'pending'">
              <Icon name="streamline:interface-block-remove-circle-garbage-trash-delete"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else>
        <p>Aucune invitation trouvée.</p>
      </div>
    </Card>
  </NuxtLayout>
</template>

<script setup lang="ts">
const {$apiClient} = useNuxtApp();

const filteredInviters = computed(() => {
  if (filterStatus.value) {
    return invites.value.filter((invite) => invite.status === filterStatus.value);
  }
  return invites.value;
});

function updateStatutOrClear(status: string) {
  if (filterStatus.value === status) {
    filterStatus.value = null;
  } else {
    filterStatus.value = status;
  }
}

async function acceptInvite(inviteId: number) {
  const res = await $apiClient.put(`/invites/${inviteId}`, { status: 'accepted' });
  if (res.ok) {
    const resData = await res.json();
    window.location.href = 'house_share/' + resData.houseSHareId;
  } else {
    alert("Erreur lors de l'acceptation de l'invitation");
  }
}

async function cancelInvite(inviteId: number) {
  const res = await $apiClient.put(`/invites/${inviteId}`, { status: 'declined' });
  if (res.ok) {
    const resData = await res.json();
  } else {
    alert("Erreur lors de l'annulation de l'invitation");
  }
}

function inviteStatusToFrench(status: string) {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'accepted':
      return 'Acceptée';
    case 'cancelled':
      return 'Annulée';
    case 'declined':
      return 'Rejetée';
    default:
      return status;
  }
}

const filterStatus = ref<string | null>(null);
const invites = ref<object[]>([]);
async function loadInvites() {
  const res = await $apiClient.get('/invites');
  if (res.ok) {
    const resData = await res.json();
    invites.value = resData;
  } else {
    alert("Erreur lors du chargement des invitations");
  }
}
await loadInvites();

async function postHouseShare() {
  const form = document.getElementById('create-house-share');
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    address: formData.get('address')
  }
  const res = await $apiClient.post(`/house-share`, data);
  if (res.ok) {
    const resData = await res.json();
    window.location.href = 'house_share/' + resData.id;
  } else {
    alert("Erreur lors de la création de la colocation");
  }
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.tabs button.active {
  background-color: #ccc;
  font-weight: bold;
}
table {
  border-collapse: collapse;
  width: 100%;
}

tr {
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.34);
}

td {
  padding: 8px;
}

tr:last-child {
  border: none;
}

.invite-status-pending {
  color: orange;
}

.invite-status-accepted {
  color: #128d2b;
}

.invite-status-cancelled {
  color: #EB5160FF;
}

.invite-status-declined {
  color: #EB5160FF;
}
.reject-button {
  background-color: #EB5160FF;
  color: white;
  padding: 3px;
  border: none;
  border-radius: 5px;
}
.reject-button:hover {
  background-color: #d93141;
  cursor: pointer;
}
.accept-button {
  background-color: #178a2a;
  color: white;
  padding: 3px;
  border: none;
  border-radius: 5px;
}
.accept-button:hover {
  background-color: #0f6b1e;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons span {
  font-size: 20px;
}

</style>