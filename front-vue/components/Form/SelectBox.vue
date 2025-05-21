<script setup lang="ts">
defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => Array<{ id: number; name: string }>,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  allowNull: {
    type: Boolean,
    default: false
  },
  nullValue: {
    type: String,
    default: 'Sélectionner une option'
  },
  emptyValue: {
    type: String,
    default: 'Sélectionner une option'
  }
})

const selectedValues = ref<number[]>([]);

defineEmits(['update:modelValue']);

function addValue(value: number) {
  selectedValues.value.push(value);
}

function removeValue(value: number) {
  const index = selectedValues.value.indexOf(value);
  if (index !== -1) {
    selectedValues.value.splice(index, 1);
  }
}

const open = ref(false);
</script>

<template>
  <span>{{ name }}</span>
  <div style="width: 100%; position: relative;">
    <div class="select-box"
         role="button"
         tabindex="0"
         @click="open = !open"
         @keydown.enter="open = !open"
         @keydown.space.prevent="open = !open">
    <span class="dropdown-arrow" v-if="!open" style="margin-right: 5px;">
      <Icon name="gridicons:chevron-down"></Icon>
    </span>
      <span class="dropdown-arrow" v-if="open" style="margin-right: 5px;">
      <Icon name="gridicons:chevron-up"></Icon>
    </span>
      <span v-for="value in selectedValues" :key="value" class="selected-value">
      {{ options.find(option => option.id === value)?.name }}
      <span class="remove-value" @click.stop="removeValue(value); $emit('update:modelValue', selectedValues)">x</span>
    </span>
      <span v-if="selectedValues.length == 0" style="color: grey;">
     {{ emptyValue }}
    </span>
      <span v-if="allowNull && selectedValues.length === 0" class="selected-value">
      {{ nullValue }}
    </span>

    </div>
    <div class="select-box-options" v-if="options.length" v-show="open">
      <div
          v-for="option in options"
          :key="option.id"
          class="select-box-option"
          :class="{ selected: selectedValues.includes(option.id) }"
          @click="selectedValues.includes(option.id) ? removeValue(option.id) : addValue(option.id); open = false; $emit('update:modelValue', selectedValues)"
      >
        {{ option.name }}
      </div>
    </div>
  </div>

</template>

<style scoped>

.select-box {
  display: flex;
  flex-wrap: wrap;
  border-radius: 5px;
  border: 1px solid #A19C9C;
  background-color: #f8f8f8;
  padding: 5px;
}

.selected-value {
  background-color: #0e1419;
  color: white;
  padding: 5px;
  border-radius: 4px;
  margin-right: 5px;
}

.remove-value {
  cursor: pointer;
  margin-left: 5px;
  color: #fff;
}

.select-box-options {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
  background-color: white;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.select-box-option {
  padding: 5px;
  cursor: pointer;
}

.select-box-option:hover {
  background-color: #f0f0f0;
}

.select-box-option.selected {
  background-color: #0e1419;
  color: white;
}

.select-box-option.selected:hover {
  background-color: #0e1419;
}
</style>