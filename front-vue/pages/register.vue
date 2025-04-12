<script setup lang="ts">
import {checkPassword, displayError} from "../../front/script/auth_utils";

const errors = ref<string[]>([]);
onMounted(() => {
  const registerForm = document.getElementById('register-form') as HTMLFormElement;
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());
    const checkPasswordErrors = checkPassword(data['password'], data['password-double']);
    if (checkPasswordErrors.length > 0) {
      errors.value = checkPasswordErrors;
      return;
    }
    const {api_url} = JSON.parse(localStorage.getItem('config') || '{}');
    const res = await fetch(`${api_url}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const resData = await res.json();
    if (res.ok) {
      localStorage.setItem('token', resData.token);
      localStorage.setItem('user', JSON.stringify(resData.user));
      window.location.href = "/";
    } else {
      if (resData.error) {
        errors.value = [resData.error];
      } else {
        errors.value = ['Une erreur est survenue.'];
      }
    }
  })
});

function checkPassword(password: string | null, passwordDouble: string | null) {
  const errors = [];
  if (!password || !passwordDouble) {
    errors.push('Password is required');
    return errors;
  }
  if (password !== passwordDouble) errors.push('Passwords do not match');
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!password.match(/[A-Z]/) && !password.match(/[0-9]/)) errors.push('Password must contain at least one uppercase letter or one number');
  return errors;
}
</script>

<template>
  <NuxtLayout name="auth">
    <form action="" method="post" id="register-form">
      <FormErrorBox :errors="errors"/>
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="example@gmail.com" required>
      </div>
      <div class="input-group">
        <label for="name">Nom</label>
        <input type="text" name="name" id="name" placeholder="Smith" required>
      </div>
      <div class="input-group">
        <label for="first_name">Prénom</label>
        <input type="text" name="first_name" id="first_name" placeholder="John" required>
      </div>
      <div class="input-group">
        <label for="phone_number">Téléphone</label>
        <input type="tel" name="phone_number" id="phone_number" placeholder="06 12 34 56 78 99" required>
      </div>
      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input type="password" name="password" id="password" placeholder="*********" required>
      </div>
      <div class="input-group">
        <label for="password-double">Confirmation mot de passe</label>
        <input type="password" name="password-double" id="password-double" placeholder="*********" required>
      </div>
      <button type="submit" class="submit">Inscription</button>
    </form>
  </NuxtLayout>
</template>

<style>
.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
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