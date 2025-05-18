<script setup lang="ts">
const {$apiClient} = useNuxtApp();

const houseShareId = ref<number | null>(null);
const sharedFundId = ref<number | null>(null);
const isAdmin = ref(false);
const isAdminColocMode = ref(false);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  isAdmin.value = user.is_admin === true;
  isAdminColocMode.value = localStorage.getItem('admin_real_user') !== null;
});

async function loadIds() {
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

await loadIds();
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
    
    <!-- Utilisateur normal OU admin en mode Coloc - tous les liens habituels -->
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
</style>