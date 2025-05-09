<script setup lang="ts">
const {$apiClient} = useNuxtApp();
const route = useRoute();

const sharedFund = ref<any>(null);
const contributions = ref<any[]>([]);
const isModalOpen = ref(false);
const displayAll = ref(false);
const historyButtonTitle = computed(() => {
  return displayAll.value ? 'Afficher moins' : 'Afficher plus';
});

async function loadSharedFund() {
  const res = await $apiClient.get(`/shared-fund/${route.params.id}`);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    window.location.href = '/';
  }
  sharedFund.value = data;
}

async function loadContributions(limit: number) {
  const res = await $apiClient.get(`/shared-fund/${route.params.id}/contributions?limit=${limit}`);
  const data = await res.json();
  if (!res.ok && data.error) {
    alert(data.error);
    return;
  }
  contributions.value = data;
}

async function changeDisplayMode() {
  displayAll.value = !displayAll.value;
  await loadContributions(displayAll.value ? 100 : 5);
}

async function loadData(limit: number, offset: number) {
  const res = await $apiClient.get(`/shared-fund/${route.params.id}/contributions?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  if (!res.ok && data.error) {
    return [];
  }
  return data;
}

function getHeaderTitle(key: string) {
  switch (key) {
    case 'firstname':
      return 'Prénom';
    case 'name':
      return 'Nom';
    case 'date':
      return 'Date';
    case 'amount':
      return 'Montant (€)';
    default:
      return key;
  }
}

const contributionForm = ref<HTMLFormElement | null>(null);
const errors = ref<string[]>([]);

async function handleApiResponse(response: Response, defaultError: string) {
  const data = await response.json();
  if (!response.ok) {
    errors.value = [data.error || defaultError];
    throw new Error(data.error || defaultError);
  }
  return data;
}

async function postContribution() {
  try {
    if (!contributionForm.value) return;
    const formData = getFormData(contributionForm);
    const res = await $apiClient.post(`/shared-fund/${route.params.id}/contributions`, formData);
    await handleApiResponse(res, 'Failed to add contribution');
    await loadSharedFund();
    await loadContributions(displayAll.value ? 100 : 5);
  } catch (error) {
    console.error(error);
  }
}

await loadSharedFund();
await loadContributions(5);
</script>

<template>
    <NuxtLayout title="Cagnotte">
        <Card
            title="Informations"
            icon="mdi:information-slab-box-outline"
            :display-button="false"
        >
            <template #default>
                <p>Nom de la colocation: {{ sharedFund?.house_share_name || 'Chargement...' }}</p>
                <p>Montant total: {{ sharedFund?.amount || '0' }}€</p>
            </template>
        </Card>
        <Card
            title="Ajouter à la cagnotte"
            icon="material-symbols:payments-outline"
            :on-button-click="postContribution"
            button-text="Ajouter"
        >
        <template #default>
            <form ref="contributionForm">
                <FormErrorBox :errors="errors"/>
                <FormInput name="amount" label="Montant" input-type="number"/>
            </form>
        </template>
        </Card>
      
        <Card 
            title="Historique des versements" 
            icon="mdi:history" 
            :on-button-click="changeDisplayMode"
            :button-text="historyButtonTitle"
            fullscreen-button
            :fullscreen-click="() => isModalOpen = true"
        >
            <template #default>
                <table v-if="contributions && contributions.length > 0">
                    <tr v-for="(contribution, index) in contributions" :key="index" class="contribution-item">
                    <td>{{ contribution.firstname }}</td>
                    <td>{{ contribution.name }}</td>
                    <td>{{ new Date(contribution.date).toLocaleDateString() }}</td>
                    <td class="end">{{ contribution.amount }}€</td>
                    </tr>
                </table>
                <p v-else class="center">
                    <span class="bubble">Aucun versement effectué</span>
                </p>
            </template>
        </Card>
      
        <Modal v-model="isModalOpen" title="Historique des versements">
            <AdvancedTable :source-dataset-headers="getHeaderTitle" :data-source="loadData"/>
        </Modal>
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

.bubble {
  background-color: #071013FF;
  border-radius: 10px;
  padding: 5px 10px;
  margin-bottom: 10px;
  color: white;
}

.end {
  text-align: end;
}

.center {
  text-align: center;
}

.contribution-item {
  border-bottom: 1px solid #d0d0d0;
}

.contribution-item:last-child {
  border-bottom: none;
}
</style>