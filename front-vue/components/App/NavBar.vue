<script setup lang="ts">
import { eventBus } from '~/utils/event-bus';

const {$apiClient} = useNuxtApp();

const houseShareId = ref<number | null>(null);
const sharedFundId = ref<number | null>(null);
const isAdmin = ref(false);
const isAdminColocMode = ref(false);
const adminColocId = ref<string | null>(null);
const route = useRoute();

function checkUserStatus() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  isAdmin.value = user.is_admin === true;
  adminColocId.value = localStorage.getItem('admin_coloc_id');
  isAdminColocMode.value = adminColocId.value !== null;
}

async function loadIds() {
  // Si nous sommes en mode admin coloc, utiliser cet ID
  if (isAdminColocMode.value && adminColocId.value) {
    houseShareId.value = Number(adminColocId.value);
    
    // Charger aussi l'ID de la cagnotte associée
    const res = await $apiClient.get(`/house-share/${adminColocId.value}`);
    if (res.ok) {
      const data = await res.json();
      sharedFundId.value = data.shared_fund_id;
    }
    return;
  }
  
  // Sinon, chargement normal
  const res = await $apiClient.get(`/me`);
  if (!res) return;
  const resData = await res.json();
  if (!res.ok) {
    alert(resData.error);
    return;
  }
  houseShareId.value = resData?.houseShareId;
  sharedFundId.value = resData?.sharedFundId;
}

function exitAdminColocMode() {
  localStorage.removeItem('admin_coloc_id');
  checkUserStatus();
  loadIds();
  navigateTo('/admin');
}

onMounted(() => {
  checkUserStatus();
  loadIds();
  
  // Écouter les changements de mode admin coloc
  eventBus.on('admin-coloc-mode-changed', (isActive: boolean) => {
    isAdminColocMode.value = isActive;
    checkUserStatus();
    loadIds();
  });
});

// Nettoyer les écouteurs d'événements à la destruction du composant
onUnmounted(() => {
  eventBus.off('admin-coloc-mode-changed', () => {});
});

// Surveiller les changements de route pour mettre à jour le statut
watch(() => route.path, () => {
  checkUserStatus();
  loadIds();
}, { immediate: true });

// Surveiller directement localStorage également
watch(() => localStorage.getItem('admin_coloc_id'), () => {
  checkUserStatus();
  loadIds();
});
</script>


<template>
  <nav>
    <!-- Admin en mode normal - seulement le lien Administration -->
    <div v-if="isAdmin && !isAdminColocMode" class="nav-item">
      <NuxtLink to="/admin">
        <Icon name="mdi:shield-account"/>
        Administration
      </NuxtLink>
    </div>
    
    <!-- Admin en mode Coloc - tous les liens habituels + liens d'admin -->
    <template v-else-if="isAdmin && isAdminColocMode">
      <div class="nav-item admin-nav-item">
        <NuxtLink to="/admin">
          <Icon name="mdi:shield-account"/>
          Admin
        </NuxtLink>
      </div>
      
      <div class="nav-item admin-exit-button" @click="exitAdminColocMode">
        <Icon name="mdi:logout"/>
        Quitter mode coloc
      </div>
      
      <div class="separator"></div>
      
      <div class="nav-item">
        <NuxtLink to="/">
          <Icon name="mdi:home-variant"/>
          Acceuil
        </NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink v-if="!houseShareId" to="/house_share">Colocation</NuxtLink>
        <NuxtLink v-else :to="{ name: 'house_share-id', params: { id: houseShareId }}">Colocation</NuxtLink>
      </div>
      <div v-if="sharedFundId" class="nav-item">
        <NuxtLink :to="{ name: 'shared_fund-id', params: { id: sharedFundId }}">Cagnotte</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink to="/transfer">Versement</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink to="/purchase">Paiement</NuxtLink>
      </div>
    </template>
    
    <!-- Utilisateur normal - tous les liens habituels -->
    <template v-else>
      <div class="nav-item">
        <NuxtLink to="/">
          <Icon name="mdi:home-variant"/>
          Acceuil
        </NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink v-if="!houseShareId" to="/house_share">Colocation</NuxtLink>
        <NuxtLink v-else :to="{ name: 'house_share-id', params: { id: houseShareId }}">Colocation</NuxtLink>
      </div>
      <div v-if="sharedFundId" class="nav-item">
        <NuxtLink :to="{ name: 'shared_fund-id', params: { id: sharedFundId }}">Cagnotte</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink to="/transfer">Versement</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink to="/purchase">Paiement</NuxtLink>
      </div>
    </template>
  </nav>
</template>

<style scoped>
a {
  text-decoration: none;
  color: white;
}

.nav-item {
  padding: 15px 20px;
  font-size: 18px;
  transition: background-color 0.3s;
}

.nav-item:hover a, .router-link-active {
  border-bottom: 2px solid #EB5160FF;
}

.admin-nav-item {
  background-color: #071013;
}

.admin-exit-button {
  background-color: #EB5160FF;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-exit-button:hover {
  background-color: #d83848;
}

.separator {
  width: 100%;
  height: 2px;
  background-color: #333;
  margin: 5px 0;
}
</style>