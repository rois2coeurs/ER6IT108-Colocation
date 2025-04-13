<script setup lang="ts">
const {$apiClient} = useNuxtApp();

const houseShareId = await getHouseShareId();

async function getHouseShareId() {
  const res = await $apiClient.get(`/me/house-share`);
  if (!res) return;
  const resData = await res.json();
  if (res.ok && resData.houseShareId) {
    return resData.houseShareId;
  }
}
</script>
<template>
    <nav>
      <div class="nav-item">
        <NuxtLink to="/"><Icon name="mdi:home-variant" /> Acceuil</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink v-if="!houseShareId" to="/house_share">Colocation</NuxtLink>
        <NuxtLink v-else :to="'/house_share/' + houseShareId">Colocation</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink to="/shared_fund">Cagnotte</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink to="/transfer">Versement</NuxtLink>
      </div>
      <div class="nav-item">
        <NuxtLink to="/purchase">Paiement</NuxtLink>
      </div>
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