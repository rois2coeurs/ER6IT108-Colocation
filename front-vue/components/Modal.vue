<script setup lang="ts">
const open = ref(false);
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Title'
  }
});
const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (newValue) => {
  open.value = newValue;
});
watch(open, (newValue) => {
  emit('update:modelValue', newValue);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    open.value = false;
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <h1 class="title">{{ title }}</h1>
      <div class="content">
        <slot>
          Default content
        </slot>
      </div>
        <Icon name="material-symbols:cancel" @click="open = false" class="close-button" title="Fermer"/>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
}

.close-button:hover {
  background-color: darkred;
  cursor: pointer;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-top: 20px;
  font-weight: bold;
  text-decoration: underline;
}

.content {
  padding: 20px;
}
</style>