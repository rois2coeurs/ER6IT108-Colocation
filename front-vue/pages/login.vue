<script setup lang="ts">
const errors = ref<string[]>([]);
await checkToken();
const urlParams = new URLSearchParams(window.location.search);
async function checkToken() {
  const {api_url} = JSON.parse(localStorage.getItem('config') || '{}');
  if (localStorage.getItem('token') && api_url) {
    const res = await fetch(`${api_url}/validate`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else {
      window.location.href = urlParams.get("redirect") || '/';
    }
  }
}
onMounted(() => {
  const loginForm = document.getElementById('login-form') as HTMLFormElement;
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    const config = JSON.parse(localStorage.getItem('config') || '{}');
    const res = await fetch(`${config.api_url}/login`, {
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
      window.location.href = urlParams.get("redirect") || '/';
    } else {
      if (resData.error) {
        errors.value = [resData.error];
      } else {
        errors.value = ['Une erreur est survenue.'];
      }
    }
  })
})

</script>

<template>
  <NuxtLayout name="auth">
    <form action="" method="post" id="login-form">
      <FormErrorBox :errors="errors" />
      <div class="form-input-group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="example@gmail.com" required>
      </div>
      <div class="form-input-group">
        <label for="password">Mot de passe</label>
        <input type="password" name="password" id="password" placeholder="*********" required>
      </div>
      <button type="submit" class="submit">Connection</button>
    </form>
  </NuxtLayout>
</template>

<style>
.form-input-group {
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