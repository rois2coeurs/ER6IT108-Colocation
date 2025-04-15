<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  inputType: {
    type: String,
    default: 'text'
  }
})
const value = defineModel('value');
</script>

<template>
  <div class="form-input-group">
    <label :for="name">{{ label }}</label>
    <input :type="inputType" :name="name" type="{{inputType}}" v-model="value" />
  </div>
</template>

<style>
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
</style>