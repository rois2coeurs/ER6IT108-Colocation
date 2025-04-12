<script setup lang="ts">
defineProps({
  errors: {
    type: Array<String>,
    default: []
  }
});
</script>

<template>
  <div v-if="errors.length > 0" id="transfer-error" class="form-error-box" >
    <ul>
      <li v-for="(err, index) in errors" :key="index">
        ⚠️ {{ err }}
      </li>
    </ul>
  </div>
</template>

<style>
.form-error-box {
  color: darkred;
  font-size: 14px;
  font-weight: bold;
  margin: 5px 5px 15px;
}
</style>