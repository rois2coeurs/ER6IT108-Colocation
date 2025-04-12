<template>
  <NuxtLayout title="Colocation">
    <Card
        title="Crée une colocation"
        icon="mdi-home-plus-outline"
        :on-button-click="postHouseShare"
        button-text="Crée la colocation"
    >
      <template #default>
        <form id="create-house-share">
          <FormInput name="name" label="Nom de la colocation" required/>
          <FormInput name="address" label="Adresse" required/>
        </form>
      </template>
    </Card>
    <Card title="Rejoindre une colocation" icon="mdi:history">
      <template>
        <p>Content goes here</p>
      </template>
    </Card>
  </NuxtLayout>
</template>

<script setup lang="ts">
const {$apiClient} = useNuxtApp();

async function postHouseShare() {
  const form = document.getElementById('create-house-share');
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    address: formData.get('address')
  }
  const res = await $apiClient.post(`/house-share`, data);
  if (res.ok) {
    const resData = await res.json();
    window.location.href = 'house_share/' + resData.id;
  } else {
    alert("Erreur lors de la création de la colocation");
  }
}
</script>

<style scoped>

</style>