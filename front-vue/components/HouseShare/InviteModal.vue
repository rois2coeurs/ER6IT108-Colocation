<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits(['update:modelValue']);

const email = ref('');

function closeModal() {
  emit('update:modelValue', false);
}

function sendInvitation() {
  emit('send-invitation', email.value);
}
</script>

<template>
  <div v-if="props.modelValue" class="modal-backdrop">
    <div class="modal">
      <h2>Inviter un utilisateur</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Email de l'utilisateur"
        class="input"
      />
      <div class="actions">
        <button @click="sendInvitation" :disabled="!email">Envoyer l'invitation</button>
        <button @click="closeModal" class="close-btn">Annuler</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.close-btn {
  background: #eee;
  color: #333;
}
</style>
