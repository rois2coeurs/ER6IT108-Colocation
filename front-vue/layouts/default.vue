<script setup>
defineProps({
  title: String
});
</script>
<template>
  <div class="body">
    <div class="main-container">
      <div class="sidebar">
        <AppNavBar/>
      </div>
      <div class="content-area">
        <AppHeader :title="title"/>
        <div class="container">
          <slot/>
        </div>
      </div>
    </div>
    <AppFooter/>
  </div>
</template>

<style>
body {
  font-family: 'Inter', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>

<style scoped>
.content-area {
  flex: 1;
  padding: 20px;
}

.sidebar {
  width: 250px;
  background-color: #0e1419;
  color: white;
  padding-top: 40px;
}

.body {
  background-color: #f2f2f2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex: 1;
}

.container {
  display: flex;
  flex-direction: row;
  gap: 40px;
  flex-wrap: wrap;
}
</style>