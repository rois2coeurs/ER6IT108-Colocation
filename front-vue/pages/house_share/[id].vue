<script setup lang="ts">
const {$apiClient} = useNuxtApp();
const route = useRoute()

const title = ref("Vous faites partie de [Nom Colocation]");
const houseShare = ref<HouseShare | null>(null)
const members = ref<Member[]>([]);
const isUserManager = ref(false);
const memberDisplayAll = ref(false);
const memberButtonTitle = computed(() => {
  return memberDisplayAll.value ? 'Afficher les membres actuelles' : 'Afficher les anciens membres';
})
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
};
await loadHouseShare();
await loadMembers(true);

async function kickMember(memberId: number) {
  const res = await $apiClient.put(`/house-share/${route.params.id}/members/${memberId}`, null);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  members.value = members.value.filter(member => member.id !== memberId);
}

async function switchMemberDisplayMode() {
  memberDisplayAll.value = !memberDisplayAll.value;
  await loadMembers(!memberDisplayAll.value);
}
</script>

<template>
  <NuxtLayout :title="title">
    <Card
        title="Membres"
        icon="mdi:human-queue"
        :on-button-click="switchMemberDisplayMode"
        :button-text="memberButtonTitle"
    >
      <template #default>
        <table>
          <tr v-for="(member, index) in members" :key="index" class="member-item">
            <td>
              <Icon v-if="member.id === houseShare?.manager_id" name="mdi:crown" style="color: orange;"/>
              {{ member.firstname }}
            </td>
            <td>{{ member.name }}</td>
            <td><Icon name="mdi:calendar-start" /> {{ new Date(member.entry_date).toLocaleDateString() }}</td>
            <td v-if="memberDisplayAll"><Icon name="mdi:exit-run" /> {{new Date(member.exit_date).toLocaleDateString()}}</td>
            <td v-if="isUserManager && member.id != getUserId() && !memberDisplayAll">
              <button class="kick-button" @click="kickMember(member.id)">Exclure</button>
            </td>
          </tr>
        </table>
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