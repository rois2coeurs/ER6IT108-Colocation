<script setup lang="ts">
const user = JSON.parse(localStorage.getItem("user") || "{}");
const {$apiClient} = useNuxtApp();
const isEditing = ref(false);
const form = ref<HTMLFormElement | null>(null);
const errors = ref<string[]>([]);
const formData = ref({
  name: user.name,
  firstname: user.firstname,
  phone_number: user.phone_number,
  password: '',
  password_confirmation: ''
});

function toggleEdit() {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    formData.value.name = user.name;
    formData.value.firstname = user.firstname;
    formData.value.phone_number = user.phone_number;
    formData.value.password = '';
    formData.value.password_confirmation = '';
    errors.value = [];
  }
}

function checkPassword(password: string | null, passwordDouble: string | null) {
  const errors: string[] = [];
  if (!password || !passwordDouble) return ['Password is required'];
  if (password !== passwordDouble) errors.push('Passwords do not match');
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!password.match(/[A-Z]/) && !password.match(/[0-9]/)) errors.push('Password must contain at least one uppercase letter or one number');
  return errors;
}

function checkPhoneNumber(phone_number: string) {
  return phone_number.match(/^[0-9]{10}$/);
}

async function updateUserInfo() {
  try {
    errors.value = [];

    // Check phone number
    if (!checkPhoneNumber(formData.value.phone_number)) {
      errors.value.push('Le numéro de téléphone doit contenir exactement 10 chiffres');
      return;
    }

    // Check password if provided
    if (formData.value.password) {
      const passwordErrors = checkPassword(formData.value.password, formData.value.password_confirmation);
      if (passwordErrors.length > 0) {
        errors.value = passwordErrors;
        return;
      }
    }
    
    const data = {
      name: formData.value.name,
      firstname: formData.value.firstname,
      phone_number: formData.value.phone_number,
      password: formData.value.password || undefined
    };
    
    const res = await $apiClient.put(`/users/${user.id}`, data);
    const resData = await res.json();
    
    if (!res.ok) {
      errors.value = [resData.error || 'Une erreur est survenue lors de la mise à jour de vos informations'];
      return;
    }
    
    // Update local user info
    const updatedUser = {
      ...user,
      name: formData.value.name,
      firstname: formData.value.firstname,
      phone_number: formData.value.phone_number
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    isEditing.value = false;
    window.location.reload();
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
        :display-button="true"
        :on-button-click="toggleEdit"
    >
      <template #default>
        <FormErrorBox :errors="errors" v-if="errors.length > 0" />
        <div v-if="!isEditing">
          <p>Nom: {{ user.name }}</p>
          <p>Prénom: {{ user.firstname }}</p>
          <p>Email: {{ user.mail }}</p>
          <p>Numéro de téléphone: {{ user.phone_number }}</p>
        </div>
        <form v-else ref="form">
          <div class="form-input-group">
            <FormInput type="text" id="firstname" label="Prénom" v-model="formData.firstname" placeholder="John" required/>
          </div>
          <div class="form-input-group">
            <FormInput type="text" id="name" label="Nom" v-model="formData.name" placeholder="Doe" required/>
          </div>
          <div class="form-input-group">
            <FormInput type="tel" id="phone_number" label="Téléphone" v-model="formData.phone_number" placeholder="0612345678" required/>
          </div>
          <div class="form-input-group">
            <FormInput type="password" id="password" label="Nouveau mot de passe" v-model="formData.password" placeholder="Laisser vide pour ne pas changer"/>
          </div>
          <div class="form-input-group">
            <FormInput type="password" id="password_confirmation" label="Confirmation du mot de passe" v-model="formData.password_confirmation" placeholder="Confirmer le nouveau mot de passe"/>
          </div>
          <button type="button" class="submit" @click="updateUserInfo">Confirmer</button>
        </form>
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
  margin-left: 5%;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: 90%;
}
</style>