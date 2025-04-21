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
    <div v-if="inputType === 'checkbox'" class="checkbox-wrapper">
      <input type="checkbox" :name="name" v-model="value" :id="name"/><label :for="name"></label>
    </div>
    <input v-else :type="inputType" :name="name" v-model="value"/>
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

.checkbox-wrapper input[type=checkbox] {
  height: 0;
  width: 0;
  display: none;
}

.checkbox-wrapper label {
  --size: 35px;

  cursor: pointer;
  width: var(--size);
  height: calc(var(--size) / 2);
  background: grey;
  display: block;
  border-radius: 100px;
  position: relative;
}

.checkbox-wrapper label:after {
  content: '';
  position: absolute;
  top: 6%;
  left: 2.5%;
  width: calc(50% - 5%);
  height: calc(100% - 11%);
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

.checkbox-wrapper input:checked + label {
  background: #EB5160FF;
}

.checkbox-wrapper input:checked + label:after {
  left: calc(100% - 2.5%);
  transform: translateX(-100%);
}

.checkbox-wrapper label:active:after {
  width: 55%;
}
</style>