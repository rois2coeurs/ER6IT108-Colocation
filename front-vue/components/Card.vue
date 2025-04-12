<script setup lang="ts">
defineProps({
  icon: String,
  title: String,
  buttonText: {
    type: String,
    default: 'Afficher Tout'
  },
  onButtonClick: Function
});
</script>

<template>
  <div class="card">
    <div class="card-header">
      <Icon :name="icon" class="icon"/>
      <h2>{{ title }}</h2>
    </div>

    <div class="card-content">
      <slot>
        <p>This is empty :(</p>
      </slot>
    </div>
    <button class="toggle" v-on:click="onButtonClick">{{ buttonText }}</button>
  </div>
</template>

<style scoped>
.card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
  min-width: 500px;
  flex: 1;
  height: fit-content;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #d0d0d0;
  padding-bottom: 10px;
}

.icon {
  font-size: 24px;
  font-weight: bold;
  color: #B7999CFF;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 500;
}

.card-content {
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
}

.toggle {
  background-color: #EB5160FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

.toggle:hover {
  background-color: #d83848;
}
</style>