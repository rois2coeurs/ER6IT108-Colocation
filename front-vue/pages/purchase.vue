<script setup lang="ts">
const {$apiClient} = useNuxtApp();
const purchases = ref<Purchase[]>([]);
let offset = 0;
const limit = 5;
const remaining = ref(0);
const historyButtonText = computed(() => {
  return `Afficher plus (restant ${remaining.value})`;
})
const isModalOpen = ref(false);
loadPurchases();

const houseShareId = ref<number | null>(null);
const sharedFundId = ref<number | null>(null);
await loadIds();

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

async function loadPurchases() {
  const res = await $apiClient.get(`/purchase?userId=${getUserId()}&offset=${offset}&limit=${limit}`);
  const data = await res.json();
  purchases.value.push(...data.purchases);
  remaining.value = data.total - purchases.value.length;
}

async function loadData(limit: number, offset: number) {
  const res = await $apiClient.get(`/purchase?userId=${getUserId()}&offset=${offset}&limit=${limit}`);
  const data = await res.json();
  return data.purchases;
}

async function loadMorePurchases() {
  offset += limit;
  await loadPurchases();
}

function getHeaderTitle(key: string) {
  switch (key) {
    case 'title':
      return 'Titre';
    case 'amount':
      return 'Montant (€)';
    case 'date':
      return 'Date';
    case 'house_share_name':
      return 'Nom de la colocation';
    case 'house_share_id':
      return 'id colocation';
    case 'shared_fund_set':
      return 'Cagnotte';
    default:
      return key;
  }
}

async function postPurchase() {
  let data = getFormData(form);
  if (!data || !data.title || !data.amount || !data.date) {
    errors.value = ['Veuillez remplir tous les champs.'];
    return;
  }
  if (new Date(data.date) > new Date()) {
    errors.value = ["La date ne peut pas être dans le futur."];
    return;
  }
  const res = await $apiClient.post('/purchase', data);
  if (!res.ok) {
    const resData = await res.json();
    alert(resData.error);
    return;
  }
  purchases.value = [];
  await loadPurchases();
  form.value?.reset();
}

const errors = ref<string[]>([]);

const form = ref<HTMLFormElement | null>(null);
</script>

<template>
  <NuxtLayout title="Mes paiements">
    <Card title="Nouvel achat" icon="bx:bxs-purchase-tag" button-icon="bx:bxs-plus-circle"
          button-text="Déclarer un nouvel achat" :on-button-click="postPurchase">
      <form ref="form">
        <FormErrorBox :errors="errors"/>
        <FormInput input-type="text" name="title" label="Nom de l'achat" placeholder="2kg de pâtes"/>
        <FormInput input-type="number" name="amount" label="Montant (€)" placeholder="2"/>
        <FormInput input-type="checkbox" name="useShareFund" label="Utiliser la cagnotte" v-if="sharedFundId"/>
        <FormInput input-type="date" name="date" label="Date de l'achat"/>
      </form>
    </Card>
    <Card title="Historique de vos achats" icon="mdi:history" :button-text="historyButtonText"
          :display-button="remaining > 0 " :on-button-click="loadMorePurchases" fullscreen-button
          :fullscreen-click="() => isModalOpen = true">
      <table v-if="purchases.length > 0">
        <tr v-for="(purchase, index) in purchases" :key="index" class="member-item">
          <td>{{ purchase.title }}</td>
          <td>{{ purchase.amount }}€</td>
          <td>{{ new Date(purchase.date).toLocaleDateString() }}</td>
          <td>
            <NuxtLink :to="'/house_share/'+purchase.house_share_id" class="hover-underline">
              <Icon name="material-symbols-light:link"/>
              {{ purchase.house_share_name }}
            </NuxtLink>
          </td>
        </tr>
      </table>
      <p v-else>Aucun achat trouvé.</p>
      <Modal v-model="isModalOpen" title="Historique des achats">
        <AdvancedTable :source-dataset-headers="getHeaderTitle" :data-source="loadData"/>
      </Modal>
    </Card>
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
  align-items: center;
}

tr:last-child {
  border: none;
}

.hover-underline:hover {
  border-bottom: #071013 solid 1px;
}
</style>