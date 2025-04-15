<script setup lang="ts">
defineProps({
  icon: String,
  title: String,
  buttonText: {
    type: String,
    default: 'Afficher Tout'
  },
  displayButton: {
    type: Boolean,
    default: true
  },
  onButtonClick: Function,
  buttonIcon: String,
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
    <Button v-if="displayButton" :onButtonClick="onButtonClick" :button-text="buttonText" :icon="buttonIcon"/>
  </div>
</template>

<style scoped>
.card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
  min-width: 550px;
  max-width: 800px;
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
</style>