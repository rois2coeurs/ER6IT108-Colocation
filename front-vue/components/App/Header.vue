<script setup>
defineProps({
  title: String
});
const email = ref('');
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user) {
    email.value = user.mail;
  }
})
</script>
<template>
  <div class="header">
    <div class="title">
      <h1>{{ title }}</h1>
    </div>
    <div class="profile">
      <span id="profile-email" class="profile-email">{{email}}</span>
      <div class="profile-icon">
        <a href="/user">
          <Icon name="mdi:account-circle-outline" class="profile-icon"/>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.title h1 {
  color: #EB5160FF;
  font-size: 24px;
  position: relative;
}

.title h1:after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #EB5160FF;
}

.profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-email {
  font-size: 16px;
}

.profile-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-icon:hover {
  cursor: pointer;
  border: 1px solid #000000;
}

.profile-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>