<script setup lang="ts">
defineProps({
  buttonText: {
    type: String,
    default: 'Afficher Tout'
  },
  onButtonClick: Function
});
</script>

<template>
  <button class="toggle" v-on:click="onButtonClick">{{ buttonText }}</button>
</template>

<style scoped>
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