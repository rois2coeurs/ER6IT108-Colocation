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

async function switchMemberDisplayMode() {
  memberDisplayAll.value = !memberDisplayAll.value;
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
</script>

<template>
  <NuxtLayout :title="title">
    <Card title="Informations" icon="mdi:information-slab-box-outline" :display-button="isUserManager"
          button-text="Modifier" :on-button-click="updateHouseShare">
      <template #default>
        <form v-if="isUserManager" ref="houseShareForm">
          <FormInput name="name" label="Nom" :value="houseShare?.name"></FormInput>
          <FormInput name="address" label="Adresse" :value="houseShare?.address"></FormInput>
        </form>
        <div v-else>
          <p>Nom: {{ houseShare?.name }}</p>
          <p>Adresse: {{ houseShare?.address }}</p>
        </div>
      </template>
    </Card>
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
      </template>
    </Card>
    <Card title="Achats (ordre décroissant)" icon="mdi:history">
      <template>
        <p>Content goes here</p>
      </template>
    </Card>
    <Card title="Actions" icon="mdi:application" :display-button="false">
      <template #default>
        <button @click="leaveHouseShare" class="sharedFund-button">
          <Icon name="icon-park-outline:funds"/>
          Crée une cagnotte
        </button>
        <div style="height: 20px;"/>
        <Button button-text="Quitter la colocation" icon="pepicons-pop:leave"
                :on-button-click="leaveHouseShare"></Button>
      </template>
    </Card>
  </NuxtLayout>
</template>

<style scoped>

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