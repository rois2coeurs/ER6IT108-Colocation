<script setup lang="ts">
const {$apiClient} = useNuxtApp();
const route = useRoute()

const title = ref("Vous faites partie de [Nom Colocation]");
const houseShare = ref<HouseShare | null>(null)
const houseShareForm = ref<HTMLFormElement | null>(null);
const members = ref<Member[]>([]);
const isUserManager = ref(false);
const memberDisplayAll = ref(false);
const memberButtonTitle = computed(() => {
  return memberDisplayAll.value ? 'Afficher les membres actuelles' : 'Afficher les anciens membres';
})
const purchases = ref<Purchase[]>([]);

const loadHouseShare = async () => {
  const res = await $apiClient.get(`/house-share/${route.params.id}`);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    window.location.href = '/';
  }
  houseShare.value = data;
  isUserManager.value = data.manager_id === getUserId();
  title.value = "Vous faites partie de \"" + data.name + "\"";
};

async function loadMembers(active: boolean) {
  const res = await $apiClient.get(`/house-share/${route.params.id}/members?active=${active}`);
  members.value = await res.json();
}

await loadHouseShare();
await loadMembers(true);

async function kickMember(memberId: number) {
  if (!confirm("Êtes-vous sûr de vouloir expulser ce membre ?")) return;
  const res = await $apiClient.put(`/house-share/${route.params.id}/members/${memberId}`, null);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  members.value = members.value.filter(member => member.id !== memberId);
}

function displayMemberContact(member: Member) {
  const contactInfo = `
    ${member.firstname} ${member.name}
    Email: ${member.mail}
    Téléphone: ${member.phone_number}
  `;
  alert(contactInfo);
}

async function switchMemberDisplayMode(displayAll: boolean = false) {
  memberDisplayAll.value = displayAll;
  await loadMembers(!memberDisplayAll.value);
}

async function updateHouseShare() {
  if (!confirm("Êtes-vous sûr de vouloir modifier la colocation ?")) return;
  const res = await $apiClient.put(`/house-share/${route.params.id}`, getFormData(houseShareForm));
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  await loadHouseShare();
}

async function transferOwnership(member: Member) {
  if (!confirm(`Êtes-vous sûr de vouloir transférer la propriété à ${member.firstname} ${member.name} ?`)) return;
  const res = await $apiClient.put(`/house-share/${route.params.id}/members/${member.id}/transfer`, null);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  location.reload();
}

async function leaveHouseShare() {
  if (!confirm("Êtes-vous sûr de vouloir quitter la colocation ?")) return;
  const res = await $apiClient.put(`/house-share/${route.params.id}/members`, null);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  window.location.href = '/';
}

async function loadPurchases() {
  purchases.value = await loadData(5, 0);
}

async function loadData(limit: number, offset: number) {
  const res = await $apiClient.get(`/house-share/${route.params.id}/purchases?offset=${offset}&limit=${limit}`);
  const data = await res.json();
  return data.purchases;
}

await loadPurchases();

const isModalOpen = ref(false);

function getHeaderTitle(key: string) {
  switch (key) {
    case 'title':
      return 'Titre';
    case 'amount':
      return 'Montant (€)';
    case 'date':
      return 'Date';
    case 'firstname':
      return 'Prénom de l\'achteur';
    case 'name':
      return 'Nom de l\'achteur';
    case 'shared_fund_set':
      return 'Cagnotte';
    default:
      return key;
  }
}

function redirectToSharedFund(id: string) {
  window.location.href = `/shared_fund/${id}`;
}

async function createSharedFund() {
  if (!confirm("Êtes-vous sûr de vouloir créer une cagnotte ?")) return;
  const res = await $apiClient.post(`/shared-fund`, {
    houseShareId: houseShare.value?.id
  });
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  window.location.href = `/shared_fund/${data.id}`;
}

const currentTab = ref<'actuels' | 'anciens' | 'invitations'>('actuels');

const invites = ref<Invite[]>([]);

async function loadInvites() {
  const res = await $apiClient.get(`/house-share/${route.params.id}/invites`);
  invites.value = await res.json();
}

await loadInvites();

function convertDateToRelativeString(date: string) {
  const now = new Date();
  const dateObj = new Date(date);
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) {
    return "Aujourd'hui";
  } else if (diffInDays === 1) {
    return "Hier";
  } else if (diffInDays < 30) {
    return `${diffInDays} jours`;
  } else if (diffInDays < 365) {
    return `${Math.floor(diffInDays / 30)} mois`;
  } else {
    return `${Math.floor(diffInDays / 365)} ans`;
  }
}

async function cancelInvite(inviteId: number) {
  if (!confirm("Êtes-vous sûr de vouloir annuler cette invitation ?")) return;
  const res = await $apiClient.put(`/invites/${inviteId}`, {
    status: 'cancelled'
  });
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  await loadInvites();
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

const InviteModal = ref(false);

async function sendInvite(email: string) {
  if (!email) {
    alert("Veuillez entrer un email valide.");
    return;
  }
  const res = await $apiClient.post(`/house-share/${route.params.id}/invites`, {
    email
  });
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  InviteModal.value = false;
  await loadInvites();
}
</script>

<template>
  <NuxtLayout :title="title">
    <Card title="Informations" icon="mdi:information-slab-box-outline" :display-button="isUserManager"
          button-text="Modifier" :on-button-click="updateHouseShare">
      <form v-if="isUserManager" ref="houseShareForm">
        <FormInput name="name" label="Nom" :value="houseShare?.name"></FormInput>
        <FormInput name="address" label="Adresse" :value="houseShare?.address"></FormInput>
      </form>
      <div v-else>
        <p>Nom: {{ houseShare?.name }}</p>
        <p>Adresse: {{ houseShare?.address }}</p>
      </div>
    </Card>
    <Card
        title="Membres"
        icon="mdi:human-queue"
        :display-button="false"
    >
      <div class="tabs">
        <button :class="{'active': currentTab === 'actuels'}"
                @click="currentTab = 'actuels'; switchMemberDisplayMode(false)">Membres actuels
        </button>
        <button :class="{'active': currentTab === 'anciens'}"
                @click="currentTab = 'anciens'; switchMemberDisplayMode(true)">Anciens Membres
        </button>
        <button :class="{'active': currentTab === 'invitations'}" @click="currentTab = 'invitations'">Invitations
        </button>
      </div>
      <table v-if="(currentTab== 'actuels' || currentTab == 'anciens') && members.length > 0">
        <tr v-for="(member, index) in members" :key="index" class="member-item">
          <td>
            <Icon v-if="member.id === houseShare?.manager_id" name="mdi:crown" style="color: orange;"/>
            {{ member.firstname }}
          </td>
          <td>{{ member.name }}</td>
          <td>
            <Icon name="mdi:calendar-start"/>
            {{ new Date(member.entry_date).toLocaleDateString() }}
          </td>
          <td v-if="memberDisplayAll && member.exit_date">
            <Icon name="mdi:exit-run"/>
            {{ new Date(member.exit_date).toLocaleDateString() }}
          </td>
          <td v-if="member.id != getUserId()" class="action-buttons">
            <button class="contact-button" @click="displayMemberContact(member)" title="Contacter">
              <Icon name="material-symbols:contact-page"/>
            </button>
            <button v-if="isUserManager && !memberDisplayAll" class="transfer-button"
                    @click="transferOwnership(member)" title="Transférer la propriété">
              <Icon name="mdi:crown"/>
            </button>
            <button v-if="isUserManager && !memberDisplayAll" class="kick-button" @click="kickMember(member.id)"
                    title="Expulser">
              <Icon name="material-symbols:person-remove"/>
            </button>
          </td>
        </tr>
      </table>
      <div v-else-if="currentTab == 'actuels' || currentTab == 'anciens'">
        <p>Aucun membre trouvé.</p>
      </div>
      <table v-if="currentTab== 'invitations' && invites.length > 0">
        <tr v-for="(invite, index) in invites" :key="index" class="member-item">
          <td>
            {{ invite.firstname }}
          </td>
          <td>{{ invite.name }}</td>
          <td :class="'invite-status-'+invite.status">
            {{ inviteStatusToFrench(invite.status) }}
          </td>
          <td>
            {{ convertDateToRelativeString(new Date(invite.date)) }}
          </td>
          <td v-if="isUserManager" class="action-buttons">
            <button class="contact-button" @click="displayMemberContact(invite)" title="Contacter">
              <Icon name="material-symbols:contact-page"/>
            </button>
            <button class="kick-button" @click="cancelInvite(invite.id)" title="Annuler l'invitation"
                    v-if="invite.status === 'pending'">
              <Icon name="material-symbols:person-remove"/>
            </button>
          </td>
        </tr>
      </table>
      <div v-else-if="currentTab == 'invitations'">
        <p>Aucune invitation trouvée.</p>
      </div>
    </Card>
    <Card title="Achats pour la colocation" icon="mdi:history" :display-button="false" fullscreen-button
          :fullscreen-click="() => isModalOpen = true">
      <table v-if="purchases.length > 0">
        <tr v-for="(purchase, index) in purchases" :key="index" class="member-item">
          <td>{{ purchase.title }}</td>
          <td>{{ purchase.amount }}€</td>
          <td>{{ new Date(purchase.date).toLocaleDateString() }}</td>
        </tr>
      </table>
      <p v-else>Aucun achat trouvé.</p>
      <Modal v-model="isModalOpen" title="Historique des achats">
        <AdvancedTable :source-dataset-headers="getHeaderTitle" :data-source="loadData"/>
      </Modal>
    </Card>
    <Card title="Actions" icon="mdi:application" :display-button="false">
      <button @click="InviteModal = true" class="sharedFund-button" v-if="isUserManager">
        <Icon name="material-symbols:add-2"/>
        Inviter un nouvel utilisateur
      </button>
      <div style="height: 20px;"/>
      <button @click="redirectToSharedFund(houseShare?.shared_fund_id.toString())" class="sharedFund-button"
              v-if="houseShare?.shared_fund_id">
        <Icon name="icon-park-outline:funds"/>
        Voir la cagnotte
      </button>
      <button @click="createSharedFund" class="sharedFund-button" v-else>
        <Icon name="icon-park-outline:funds"/>
        Crée une cagnotte
      </button>
      <div style="height: 20px;"/>
      <Button button-text="Quitter la colocation" icon="pepicons-pop:leave"
              :on-button-click="leaveHouseShare"></Button>
    </Card>
    <HouseShareInviteModal v-model="InviteModal" @send-invitation="sendInvite"></HouseShareInviteModal>
  </NuxtLayout>
</template>

<style scoped>
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

.member-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons span {
  font-size: 20px;
}

.kick-button {
  background-color: #EB5160FF;
  color: white;
  padding: 3px;
  border: none;
  border-radius: 5px;
}

.kick-button:hover {
  background-color: #d93141;
  cursor: pointer;
}

.contact-button {
  background-color: #202c34;
  color: white;
  padding: 3px;
  border: none;
  border-radius: 5px;
}

.contact-button:hover {
  background-color: #000000;
  cursor: pointer;
}

.transfer-button {
  background-color: #e59200;
  color: white;
  padding: 3px;
  border: none;
  border-radius: 5px;
}

.transfer-button:hover {
  background-color: #7a5300;
  cursor: pointer;
}

.sharedFund-button {
  background-color: #202c34;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
  font-weight: bold;
}

.sharedFund-button:hover {
  background-color: #000000;
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

.member-item {
  border-bottom: 1px solid #d0d0d0;
}

.member-item:last-child {
  border-bottom: none;
}
</style>