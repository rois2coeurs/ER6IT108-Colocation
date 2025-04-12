<script setup lang="ts">
const errors = ref<string[]>([]);
</script>

<template>
  <div class="container">
    <div class="box">
      <div class="header">
        <h2><NuxtLink to="/login">Connection</NuxtLink></h2>
        <h2><NuxtLink to="/register">Inscription</NuxtLink></h2>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: #071013FF;
  font-family: 'Inter', sans-serif;
}

input {
  border-radius: 5px;
  border: 1px solid #A19C9C;
  background-color: #D9D9D9;
  padding: 10px;
}

a {
  text-decoration: inherit;
  color: inherit;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box {
  background-color: #DFE0E2D8;
  border-radius: 5px;
  padding: 20px 50px;
  width: 300px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.router-link-active {
  text-decoration: underline;
  text-decoration-color: #EB5160FF;
}
</style>