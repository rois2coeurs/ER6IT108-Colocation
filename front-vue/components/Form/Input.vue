<script setup lang="ts">
const user = JSON.parse(localStorage.getItem("user") || "{}");
const {$apiClient} = useNuxtApp();
const isEditing = ref(false);
const formRef = ref<HTMLFormElement | null>(null);
const errors = ref<string[]>([]);

function toggleEdit() {
  isEditing.value = !isEditing.value;
  errors.value = [];
  
  if (isEditing.value) {
    // Réinitialiser le formulaire au besoin
  }
}

function checkPhoneNumber(phone_number: string) {
  return phone_number.match(/^[0-9]{10}$/);
}

function checkPassword(password: string, passwordConfirmation: string) {
  const errors = [];
  
  if (password !== passwordConfirmation) {
    errors.push('Les mots de passe ne correspondent pas');
  }
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!password.match(/[A-Z]/) && !password.match(/[0-9]/)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule ou un chiffre');
  }
  
  return errors;
}

async function updateUserInfo() {
  try {
    errors.value = [];
    const formData = getFormData(formRef);
    
    // Check phone number
    if (!checkPhoneNumber(formData.phone_number)) {
      errors.value.push('Le numéro de téléphone doit contenir exactement 10 chiffres');
      return;
    }

    // Check password if provided
    if (formData.password) {
      const passwordErrors = checkPassword(formData.password, formData.password_confirmation);
      if (passwordErrors.length > 0) {
        errors.value = passwordErrors;
        return;
      }
    }
    
    const data = {
      name: formData.name,
      firstname: formData.firstname,
      phone_number: formData.phone_number,
      password: formData.password || undefined
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
      name: formData.name,
      firstname: formData.firstname,
      phone_number: formData.phone_number
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
        <form v-else ref="formRef" id="update-user-form">
          <div class="form-input-group">
            <FormInput type="text" name="firstname" id="firstname" label="Prénom" :value="user.firstname" placeholder="John" required/>
          </div>
          <div class="form-input-group">
            <FormInput type="text" name="name" id="name" label="Nom" :value="user.name" placeholder="Smith" required/>
          </div>
          <div class="form-input-group">
            <FormInput type="tel" name="phone_number" id="phone_number" label="Téléphone" :value="user.phone_number" placeholder="0612345678" required/>
          </div>
          <div class="form-input-group">
            <FormInput type="password" name="password" id="password" label="Nouveau mot de passe" placeholder="Laisser vide pour ne pas changer"/>
          </div>
          <div class="form-input-group">
            <FormInput type="password" name="password_confirmation" id="password_confirmation" label="Confirmation du mot de passe" placeholder="Confirmer le nouveau mot de passe"/>
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