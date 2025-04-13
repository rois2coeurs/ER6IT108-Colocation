<script setup lang="ts">
const user = JSON.parse(localStorage.getItem("user") || "{}");
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
}
</script>

<template>
  <NuxtLayout title="Page utilisateur">
    <Card
        title="Vos informations"
        icon="mdi:card-account-details-outline"
        :display-button="false"
    >
      <template #default>
        <p>Nom: {{ user.name }}</p>
        <p>Prénom: {{ user.firstname }}</p>
        <p>Email: {{ user.mail }}</p>
        <p>Numéro de téléphone: {{ user.phone_number }}</p>
      </template>
    </Card>
    <Card
        title="Actions"
        icon="mdi:application"
        :display-button="false"
    >
      <template #default>
        <Button :on-button-click="logout" button-text="Déconnexion" />
      </template>
    </Card>
  </NuxtLayout>
</template>

<style scoped>

</style>