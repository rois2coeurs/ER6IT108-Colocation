<script setup lang="ts">
const {$apiClient} = useNuxtApp();
const errors = ref<string[]>([]);
const transfers = ref<Transfer[]>([]);
const displayAll = ref(false);
const formRef = ref<HTMLFormElement | null>(null);
const hasTransfers = computed(() => transfers.value.length > 0);
const historyButtonTitle = computed(() => {
  return displayAll.value ? 'Afficher moins' : 'Afficher plus';
});

async function handleApiResponse(response: Response, defaultError: string) {
  const data = await response.json();
  if (!response.ok) {
    if (!data.error) errors.value = [defaultError];
    else errors.value = [data.error];
    throw new Error(data.error || defaultError);
  }
  return data;
}

async function fetchTransfers(userId: number, limit: number) {
  return await $apiClient.get(`/transfer/${userId}?limit=${limit}`);
}

async function postTransfer(userId: number, data: any) {
  return await $apiClient.post(`/transfer/${userId}`, data);
}

async function postSendMoney() {
  try {
    const res = await postTransfer(getUserId(), getFormData(formRef));
    await handleApiResponse(res, 'Failed to send money.');
    await loadTransfers();
  } catch (error) {
    console.error(error);
  }
}

async function loadTransfers() {
  try {
    const limit = displayAll.value ? 100 : 5;
    const res = await fetchTransfers(getUserId(), limit);
    transfers.value = await handleApiResponse(res, 'Failed to load transfers.');
  } catch (error) {
    console.error(error);
  }
}

async function changeDisplayMode() {
  displayAll.value = !displayAll.value;
  await loadTransfers();
}

await loadTransfers();
</script>

<template>
  <NuxtLayout title="Colocation">
    <Card
        title="Envoyer de l'argent"
        icon="hugeicons:money-send-circle"
        :on-button-click="postSendMoney"
        button-text="Envoyer de l'argent"
    >
      <template #default>
        <form ref="formRef">
          <FormErrorBox :errors="errors"/>
          <FormInput name="recipientEmail" label="Destinataire" placeholder="john.smith@gmail.com"/>
          <FormInput name="amount" label="Montant (€)" input-type="number" placeholder="5"/>
        </form>
      </template>
    </Card>
    <Card title="Historique des versements" icon="mdi:history" :on-button-click="changeDisplayMode"
          :button-text="historyButtonTitle">
      <template #default>
        <table v-if="hasTransfers" id="transfer-history">
          <tr v-for="(transfer, index) in transfers" :key="index">
            <td>{{ transfer.firstname[0] + '.' + transfer.name }}</td>
            <td>{{ new Date(transfer.date).toLocaleDateString() }}</td>
            <td class="center"><span class="bubble">{{ transfer.is_sender === true ? "Envoyé" : "Reçu" }}</span></td>
            <td class="end">{{ transfer.amount }}€</td>
          </tr>
        </table>
        <p v-else class="center">
          <span class="bubble">Aucun transfert effectué</span>
        </p>
      </template>
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
</style>