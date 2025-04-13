<script setup lang="ts">
const {$apiClient} = useNuxtApp();
const route = useRoute()

const title = ref("Vous faites partie de [Nom Colocation]");
const houseShare = ref<HouseShare | null>(null)
const members = ref<Member[]>([]);
const loadHouseShare = async () => {
  const res = await $apiClient.get(`/house-share/${route.params.id}`);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    window.location.href = '/';
  }
  houseShare.value = data;
  title.value = "Vous faites partie de \"" + data.name + "\"";
};
const loadMembers = async () => {
  const res = await $apiClient.get(`/house-share/${route.params.id}/members`);
  members.value = await res.json();
};
await loadHouseShare();
await loadMembers();
</script>

<template>
  <NuxtLayout :title="title">
    <Card
        title="Membres"
        icon="mdi:human-queue"
        :on-button-click="() => { console.log('onButtonClick'); }"
        :button-text="'Voir tous les membres'"
    >
      <template #default>
        <div v-for="(member, index) in members" :key="index" class="member-item">
          <div class="member-info">
            <p>
              <Icon v-if="member.id === houseShare?.manager_id" name="mdi:crown" style="color: orange;"/>
              {{ member.firstname }}
            </p>
            <p>{{ member.name }}</p>
            <p>{{ new Date(member.entry_date).toLocaleDateString() }}</p>
          </div>
        </div>
      </template>
    </Card>
    <Card title="Achats (ordre décroissant)" icon="mdi:history">
      <template>
        <p>Content goes here</p>
      </template>
    </Card>
  </NuxtLayout>
</template>

<style scoped>
.member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.member-item {
  border-bottom: 1px solid #d0d0d0;
}

.member-item:last-child {
  border-bottom: none;
}
</style>