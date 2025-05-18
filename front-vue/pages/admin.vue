<script setup lang="ts">
const {$apiClient} = useNuxtApp();
import { eventBus } from '~/utils/event-bus';

const users = ref<Array<any>>([]);
const houseShares = ref<Array<any>>([]);
const sharedFunds = ref<Array<any>>([]);
const purchases = ref<Array<any>>([]);
const transfers = ref<Array<any>>([]);
const isAdminColoc = ref(false);
const selectedHouseShare = ref<any>(null);
const selectedHouseShareName = ref<string>("");
const isModalOpenUsers = ref(false);
const isModalOpenHouseShares = ref(false);
const isModalOpenSharedFunds = ref(false);
const isModalOpenPurchases = ref(false);
const isModalOpenTransfers = ref(false);
const displayCount = 10;
const route = useRoute();

// Check if user is admin and load initial state
async function checkAdminStatus() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  if (!userData.is_admin) {
    window.location.href = '/';
    return;
  }
  
  // Vérifier si on est en mode admin coloc
  const adminColocId = localStorage.getItem('admin_coloc_id');
  if (adminColocId) {
    isAdminColoc.value = true;
    
    // Charger les informations de la colocation pour afficher le nom
    try {
      const res = await $apiClient.get(`/house-share/${adminColocId}`);
      if (res.ok) {
        const houseShare = await res.json();
        selectedHouseShare.value = houseShare;
        selectedHouseShareName.value = houseShare.name;
      }
    } catch (error) {
      console.error("Erreur lors du chargement des infos de colocation:", error);
    }
  } else {
    isAdminColoc.value = false;
    selectedHouseShare.value = null;
    selectedHouseShareName.value = "";
  }
}

onMounted(async () => {
  await checkAdminStatus();
  
  // Charger les données initiales
  loadUsers();
  loadHouseShares();
  loadSharedFunds();
  loadPurchases();
  loadTransfers();
});

// Surveiller les changements du mode admin coloc
watch(() => localStorage.getItem('admin_coloc_id'), async (newValue) => {
  await checkAdminStatus();
  
  // Si nous venons de quitter le mode admin coloc, recharger les données
  if (!newValue) {
    loadUsers();
    loadHouseShares();
    loadSharedFunds();
    loadPurchases();
    loadTransfers();
  }
}, { immediate: true });

// Load all data
loadUsers();
loadHouseShares();
loadSharedFunds();
loadPurchases();
loadTransfers();

async function loadUsers() {
  const res = await $apiClient.get('/admin/users');
  users.value = await res.json();
}

async function loadHouseShares() {
  const res = await $apiClient.get('/admin/house-shares');
  houseShares.value = await res.json();
}

async function loadSharedFunds() {
  const res = await $apiClient.get('/admin/shared-funds');
  sharedFunds.value = await res.json();
}

async function loadPurchases() {
  const res = await $apiClient.get('/admin/purchases');
  purchases.value = await res.json();
}

async function loadTransfers() {
  const res = await $apiClient.get('/admin/transfers');
  transfers.value = await res.json();
}

async function loadDataUsers(limit: number, offset: number) {
  const res = await $apiClient.get(`/admin/users?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return data;
}

async function loadDataHouseShares(limit: number, offset: number) {
  const res = await $apiClient.get(`/admin/house-shares?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return data;
}

async function loadDataSharedFunds(limit: number, offset: number) {
  const res = await $apiClient.get(`/admin/shared-funds?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return data;
}

async function loadDataPurchases(limit: number, offset: number) {
  const res = await $apiClient.get(`/admin/purchases?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return data;
}

async function loadDataTransfers(limit: number, offset: number) {
  const res = await $apiClient.get(`/admin/transfers?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return data;
}

function getHeaderTitleUsers(key: string) {
  switch (key) {
    case 'id':
      return 'ID';
    case 'name':
      return 'Nom';
    case 'firstname':
      return 'Prénom';
    case 'mail':
      return 'Email';
    case 'phone_number':
      return 'Téléphone';
    case 'is_admin':
      return 'Admin';
    default:
      return key;
  }
}

function getHeaderTitleHouseShares(key: string) {
  switch (key) {
    case 'id':
      return 'ID';
    case 'name':
      return 'Nom';
    case 'address':
      return 'Adresse';
    case 'manager_id':
      return 'Manager ID';
    default:
      return key;
  }
}

function getHeaderTitleSharedFunds(key: string) {
  switch (key) {
    case 'id':
      return 'ID';
    case 'amount':
      return 'Montant (€)';
    case 'house_share_id':
      return 'ID Colocation';
    case 'house_share_name':
      return 'Nom de la colocation';
    default:
      return key;
  }
}

function getHeaderTitlePurchases(key: string) {
  switch (key) {
    case 'id':
      return 'ID';
    case 'title':
      return 'Titre';
    case 'amount':
      return 'Montant (€)';
    case 'date':
      return 'Date';
    case 'user_id':
      return 'ID Utilisateur';
    case 'firstname':
      return 'Prénom';
    case 'name':
      return 'Nom';
    case 'house_share_id':
      return 'ID Colocation';
    case 'house_share_name':
      return 'Nom de la colocation';
    case 'shared_fund_id':
      return 'ID Cagnotte';
    case 'shared_fund_set':
      return 'Cagnotte';
    default:
      return key;
  }
}

function getHeaderTitleTransfers(key: string) {
  switch (key) {
    case 'id':
      return 'ID';
    case 'sender_id':
      return 'ID Émetteur';
    case 'sender_firstname':
      return 'Prénom Émetteur';
    case 'sender_name':
      return 'Nom Émetteur';
    case 'receiver_id':
      return 'ID Destinataire';
    case 'receiver_firstname':
      return 'Prénom Destinataire';
    case 'receiver_name':
      return 'Nom Destinataire';
    case 'amount':
      return 'Montant (€)';
    case 'date':
      return 'Date';
    default:
      return key;
  }
}

async function enterAdminColocMode(houseShare: any) {
  // Enregistrer les informations de la colocation
  selectedHouseShare.value = houseShare;
  selectedHouseShareName.value = houseShare.name;
  
  // Stocker l'ID de la colocation pour la navigation
  localStorage.setItem('admin_coloc_id', houseShare.id.toString());
  
  // Émettre un événement pour informer la navbar
  eventBus.emit('admin-coloc-mode-changed', true);
  
  // Rediriger vers la page de colocation
  navigateTo(`/house_share/${houseShare.id}`);
}

function exitAdminColocMode() {
  // Supprimer le mode admin coloc
  localStorage.removeItem('admin_coloc_id');
  
  // Mise à jour manuelle des états
  isAdminColoc.value = false;
  selectedHouseShare.value = null;
  selectedHouseShareName.value = "";
  
  // Émettre un événement pour informer la navbar
  eventBus.emit('admin-coloc-mode-changed', false);
  
  // Force refresh des données
  loadUsers();
  loadHouseShares();
  loadSharedFunds();
  loadPurchases();
  loadTransfers();
}
</script>

<template>
  <NuxtLayout :title="isAdminColoc ? 'Mode Admin Coloc: ' + selectedHouseShareName : 'Administration'">
    <div v-if="isAdminColoc" class="admin-coloc-mode">
      <Card title="Actions Admin" icon="mdi:application" :display-button="false">
        <Button button-text="Quitter le mode Admin Coloc" :on-button-click="exitAdminColocMode" />
      </Card>
    </div>

    <div v-else class="admin-cards">
      <Card title="Utilisateurs" icon="mdi:account-group" fullscreen-button :fullscreen-click="() => isModalOpenUsers = true" :display-button="false">
        <table v-if="users.length > 0">
          <tr v-for="(user, index) in users.slice(0, displayCount)" :key="index" class="user-item">
            <td>{{ user.firstname }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.mail }}</td>
            <td>{{ user.phone_number }}</td>
            <td><Icon v-if="user.is_admin" name="mdi:crown" style="color: orange;"/> Admin</td>
          </tr>
        </table>
        <p v-else>Aucun utilisateur trouvé.</p>
        <Modal v-model="isModalOpenUsers" title="Liste des utilisateurs">
          <AdvancedTable :source-dataset-headers="getHeaderTitleUsers" :data-source="loadDataUsers"/>
        </Modal>
      </Card>

      <Card title="Colocations" icon="mdi:home-group" fullscreen-button :fullscreen-click="() => isModalOpenHouseShares = true" :display-button="false">
        <table v-if="houseShares.length > 0">
          <tr v-for="(houseShare, index) in houseShares.slice(0, displayCount)" :key="index" class="house-share-item">
            <td><a href="#" @click.prevent="enterAdminColocMode(houseShare)" class="hover-underline">{{ houseShare.name }}</a></td>
            <td>{{ houseShare.address }}</td>
            <td>Manager ID: {{ houseShare.manager_id }}</td>
          </tr>
        </table>
        <p v-else>Aucune colocation trouvée.</p>
        <Modal v-model="isModalOpenHouseShares" title="Liste des colocations">
          <AdvancedTable :source-dataset-headers="getHeaderTitleHouseShares" :data-source="loadDataHouseShares"/>
        </Modal>
      </Card>

      <Card title="Cagnottes" icon="icon-park-outline:funds" fullscreen-button :fullscreen-click="() => isModalOpenSharedFunds = true" :display-button="false">
        <table v-if="sharedFunds.length > 0">
          <tr v-for="(sharedFund, index) in sharedFunds.slice(0, displayCount)" :key="index" class="shared-fund-item">
            <td>{{ sharedFund.house_share_name }}</td>
            <td>{{ sharedFund.amount }}€</td>
          </tr>
        </table>
        <p v-else>Aucune cagnotte trouvée.</p>
        <Modal v-model="isModalOpenSharedFunds" title="Liste des cagnottes">
          <AdvancedTable :source-dataset-headers="getHeaderTitleSharedFunds" :data-source="loadDataSharedFunds"/>
        </Modal>
      </Card>

      <Card title="Paiements" icon="mdi:cash-multiple" fullscreen-button :fullscreen-click="() => isModalOpenPurchases = true" :display-button="false">
        <table v-if="purchases.length > 0">
          <tr v-for="(purchase, index) in purchases.slice(0, displayCount)" :key="index" class="purchase-item">
            <td>{{ purchase.title }}</td>
            <td>{{ purchase.amount }}€</td>
            <td>{{ new Date(purchase.date).toLocaleDateString() }}</td>
            <td>{{ purchase.firstname }} {{ purchase.name }}</td>
            <td>{{ purchase.house_share_name }}</td>
          </tr>
        </table>
        <p v-else>Aucun paiement trouvé.</p>
        <Modal v-model="isModalOpenPurchases" title="Liste des paiements">
          <AdvancedTable :source-dataset-headers="getHeaderTitlePurchases" :data-source="loadDataPurchases"/>
        </Modal>
      </Card>

      <Card title="Versements" icon="hugeicons:money-send-circle" fullscreen-button :fullscreen-click="() => isModalOpenTransfers = true" :display-button="false">
        <table v-if="transfers.length > 0">
          <tr v-for="(transfer, index) in transfers.slice(0, displayCount)" :key="index" class="transfer-item">
            <td>{{ transfer.sender_firstname }} {{ transfer.sender_name }}</td>
            <td>→</td>
            <td>{{ transfer.receiver_firstname }} {{ transfer.receiver_name }}</td>
            <td>{{ transfer.amount }}€</td>
            <td>{{ new Date(transfer.date).toLocaleDateString() }}</td>
          </tr>
        </table>
        <p v-else>Aucun versement trouvé.</p>
        <Modal v-model="isModalOpenTransfers" title="Liste des versements">
          <AdvancedTable :source-dataset-headers="getHeaderTitleTransfers" :data-source="loadDataTransfers"/>
        </Modal>
      </Card>
    </div>
  </NuxtLayout>
</template>

<style scoped>
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

.hover-underline:hover {
  border-bottom: #071013 solid 1px;
  cursor: pointer;
}

.admin-coloc-mode {
  margin-bottom: 20px;
}

.admin-cards {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>