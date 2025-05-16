<script setup lang="ts">
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const {$apiClient} = useNuxtApp();
let isEditing = ref(false);
let form = ref<HTMLFormElement | null>(null);
let errors = ref<string[]>([]);

function toggleEdit() {
  isEditing.value = !isEditing.value;
}

function checkPassword(password: string | null, passwordDouble: string | null) {
  let errors: string[] = [];
  if (!password || !passwordDouble) return ['Password is required'];
  if (password !== passwordDouble) errors.push('Passwords do not match');
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!password.match(/[A-Z]/) && !password.match(/[0-9]/)) errors.push('Password must contain at least one uppercase letter or one number');
  return errors;
}

async function updateUserInfo() {
  try {
    let data = getFormData(form);
    errors.value = [];

    // Check password if provided
    if (data.password) {
      let passwordErrors = checkPassword(data.password, data.password_confirmation);
      if (passwordErrors.length > 0) {
        errors.value = passwordErrors;
        return;
      }
    }

    const res = await $apiClient.put(`/users/${user.value.id}`, data);
    if (!res.ok) {
      const data = await res.json();
      errors.value = [data.error];
      return;
    }

    // Update local user info
    let updatedUser = {
      ...user.value,
      name: data.name,
      firstname: data.firstname,
      phone_number: data.phone_number
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    user.value = updatedUser;

    isEditing.value = false;
  } catch (error) {
    console.error(error);
    errors.value = ['Une erreur est survenue lors de la mise à jour de vos informations'];
  }
}

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
        :button-text="isEditing ? 'Annuler' : 'Modifier'"
        :display-button="!isEditing"
        :on-button-click="toggleEdit"
    >
      <div v-if="!isEditing">
        <p>Prénom: {{ user.firstname }}</p>
        <p>Nom: {{ user.name }}</p>
        <p>Email: {{ user.mail }}</p>
        <p>Numéro de téléphone: {{ user.phone_number }}</p>
      </div>
      <form v-else ref="form" class="form-input-group" @submit.prevent="updateUserInfo">
        <FormErrorBox :errors="errors"/>
        <FormInput name="firstname" label="Prénom" :value="user.firstname" placeholder="John"/>
        <FormInput name="name" label="Nom" :value="user.name" placeholder="Doe"/>
        <FormInput input-type="tel" name="phone_number" label="Téléphone" :value="user.phone_number"
                   placeholder="0772315227 ou +33772315227"/>
        <FormInput input-type="password" name="password" label="Nouveau mot de passe" :value="user.password"
                   placeholder="Laisser vide pour ne pas changer"/>
        <FormInput input-type="password" name="password_confirmation" label="Confirmation du mot de passe"
                   :value="user.password_confirmation" placeholder="Confirmer le nouveau mot de passe"/>
        <div class="button-group">
          <button input-type="button" class="submit">Confirmer</button>
          <button class="cancel">Annuler</button>
        </div>
      </form>
    </Card>
    <Card
        title="Actions"
        icon="mdi:application"
        :display-button="false"
    >
      <Button :on-button-click="logout" button-text="Déconnexion"/>
    </Card>
  </NuxtLayout>
</template>

<style scoped>
.form-input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-input-group input {
  border-radius: 5px;
  border: 1px solid #A19C9C;
  background-color: #f8f8f8;
  padding: 10px;
}

.submit {
  margin-top: 20px;
  background-color: #EB5160FF;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: 45%;
  margin-right: 5%;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.cancel {
  margin-top: 20px;
  background-color: #808080;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: 45%;
  margin-left: 5%;
}
</style>