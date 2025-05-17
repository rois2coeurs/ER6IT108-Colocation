<script setup lang="ts">
import Loader from "~/components/Loader.vue";
import {ref, computed, watch} from 'vue';

const props = defineProps({
  dataSource: {
    type: Function,
    required: true
  },
  sourceDatasetHeaders: {
    type: Function,
    required: true
  }
})
const sourceDataset = ref<Array<any>>([]);
const loading = ref(false);
loadDataset();
const dataset = ref<Array<any>>(sourceDataset.value);

async function loadDataset() {
  let offset = 0;
  let data = [];
  loading.value = true;
  do {
    data = await props.dataSource(100, offset);
    sourceDataset.value.push(...data);
    offset += data.length;
  } while (data.length > 0);
  loading.value = false;
}

const searchInput = ref('');
watch(searchInput, (newValue) => {
  if (newValue === '') {
    dataset.value = sourceDataset.value;
  } else {
    dataset.value = sourceDataset.value.filter((row) => {
      return Object.values(row).some((value) => {
        return displayValue(value).toLowerCase().includes(newValue.toLowerCase());
      });
    });
  }
  if (sortByKey.value !== '') {
    if (sortOrder.value === 'asc') {
      sortBy(sortByKey.value);
    } else {
      sortByDesc(sortByKey.value);
    }
  }
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value);
  }
});
const sortBy = (key: string) => {
  if (dataset.value.length < 2) return;
  if (canCastToNumber(dataset.value[0][key])) {
    dataset.value.sort((a, b) => {
      return Number(a[key]) - Number(b[key]);
    });
    return;
  }
  if (canCastToDate(dataset.value[0][key])) {
    dataset.value.sort((a, b) => {
      return new Date(a[key]).getTime() - new Date(b[key]).getTime();
    });
    return;
  }
  dataset.value.sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
};
const sortByDesc = (key: string) => {
  if (dataset.value.length < 2) return;
  if (canCastToNumber(dataset.value[0][key])) {
    dataset.value.sort((a, b) => {
      return Number(b[key]) - Number(a[key]);
    });
    return;
  }
  if (canCastToDate(dataset.value[0][key])) {
    dataset.value.sort((a, b) => {
      return new Date(b[key]).getTime() - new Date(a[key]).getTime();
    });
    return;
  }
  dataset.value.sort((a, b) => {
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  });
};
const sort = (key: string) => {
  if (sortByKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    if (sortOrder.value === 'asc') {
      sortBy(key);
    } else {
      sortByDesc(key);
    }
  } else {
    sortByKey.value = key;
    sortOrder.value = 'asc';
    sortBy(key);
  }
};
const sortByKey = ref('');
const sortOrder = ref('asc');
const sortIcon = (key: string) => {
  if (sortByKey.value === key) {
    return sortOrder.value === 'asc' ? 'uil:sort-amount-up' : 'uil:sort-amount-down';
  }
  return 'uil:sort';
}

function canCastToDate(value: any): boolean {
  return !isNaN(Date.parse(value));
}

function canCastToNumber(value: any): boolean {
  return !isNaN(Number(value));
}

function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

function displayValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (isBoolean(value)) {
    return value ? 'Oui' : 'Non';
  }
  if (canCastToNumber(value)) {
    let zeroes = 0;
    while (zeroes < value.length) {
      if (value[zeroes] !== '0') break;
      zeroes++;
    }
    if (zeroes === 0) return Number(value).toLocaleString();
    let res = Number(value).toString();
    while (zeroes > 0) {
      res = '0' + res;
      zeroes--;
    }
    return res;
  }
  if (canCastToDate(value)) {
    return new Date(value).toLocaleDateString();
  }
  return String(value);
}

function highlightMatch(value: any, search: string): string {
  if (!search) return displayValue(value);
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearch})`, 'gi');
  return displayValue(value).replace(regex, '<mark>$1</mark>');
}

const limitOptions = [10, 25, 50, 100];
const selectedLimit = ref(limitOptions[0]);
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(dataset.value.length / selectedLimit.value));

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

const paginatedDataset = computed(() => {
  const start = (currentPage.value - 1) * selectedLimit.value;
  const end = start + selectedLimit.value;
  return dataset.value.slice(start, end);
});

const visiblePages = computed(() => {
  const maxVisiblePages = 5;
  if (totalPages.value <= maxVisiblePages) {
    return Array.from({length: totalPages.value}, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(currentPage.value - halfVisible, 1);
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
});

const showFirstPageButton = computed(() => !visiblePages.value.includes(1));
const showLastPageButton = computed(() => !visiblePages.value.includes(totalPages.value));

const isEmpty = computed(() => sourceDataset.value.length === 0 && !loading.value);
</script>

<template>
  <div class="advanced-table">
    <div class="table-controls">
      <div class="search-container">
        <Icon name="uil:search" class="search-icon"/>
        <input
            type="text"
            placeholder="Rechercher..."
            class="search-input"
            v-model="searchInput"
        />
      </div>
      <div class="limit-selector">
        <span>Lignes par page:</span>
        <select v-model="selectedLimit" @change="currentPage = 1">
          <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div class="table-wrapper">
      <Loader v-if="loading" class="center-loader"/>
      <div v-else-if="isEmpty" class="empty-state">
        <Icon name="mdi:table-off" class="empty-icon"/>
        <p>Aucune donnée disponible</p>
      </div>
      <div v-else class="table-container">
        <table>
          <thead>
          <tr>
            <th v-for="(header, index) in Object.keys(sourceDataset[0])" :key="index">
              <div @click="sort(header)" class="sortable">
                <span>{{ sourceDatasetHeaders(header) }}</span>
                <Icon :name="sortIcon(header)" class="sort-icon" :class="{ active: sortByKey === header }"/>
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in paginatedDataset" :key="index">
            <td v-for="(value, key) in row" :key="key" v-html="highlightMatch(value, searchInput)">
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!loading && !isEmpty" class="pagination-container">
      <div class="pagination">
        <button
            v-if="currentPage > 1"
            @click="goToPage(1)"
            class="pagination-button"
            title="Première page"
        >
          <Icon name="mdi:page-first"/>
        </button>

        <button
            v-if="currentPage > 1"
            @click="goToPage(currentPage - 1)"
            class="pagination-button"
            title="Page précédente"
        >
          <Icon name="mdi:chevron-left"/>
        </button>

        <button
            v-if="showFirstPageButton"
            @click="goToPage(1)"
            class="pagination-button"
        >
          1
        </button>

        <span v-if="showFirstPageButton && visiblePages[0] > 2" class="pagination-ellipsis">...</span>

        <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="pagination-button"
            :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>

        <span v-if="showLastPageButton && visiblePages[visiblePages.length - 1] < totalPages - 1"
              class="pagination-ellipsis">...</span>

        <button
            v-if="showLastPageButton"
            @click="goToPage(totalPages)"
            class="pagination-button"
        >
          {{ totalPages }}
        </button>

        <button
            v-if="currentPage < totalPages"
            @click="goToPage(currentPage + 1)"
            class="pagination-button"
            title="Page suivante"
        >
          <Icon name="mdi:chevron-right"/>
        </button>

        <button
            v-if="currentPage < totalPages"
            @click="goToPage(totalPages)"
            class="pagination-button"
            title="Dernière page"
        >
          <Icon name="mdi:page-last"/>
        </button>
      </div>

      <div class="pagination-info">
        Page {{ currentPage }} sur {{ totalPages }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.advanced-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.search-container {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 18px;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: #f9f9f9;
}

.search-input:focus {
  outline: none;
  border-color: #B7999C;
  box-shadow: 0 0 0 2px rgba(183, 153, 156, 0.2);
  background-color: white;
}

.limit-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.limit-selector select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.limit-selector select:focus {
  outline: none;
  border-color: #B7999C;
  box-shadow: 0 0 0 2px rgba(183, 153, 156, 0.2);
}

.table-wrapper {
  position: relative;
  min-height: 200px;
}

.center-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #e0e0e0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #B7999C;
}

.table-container {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-height: 55vh;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #444;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

.sortable {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
}

.sortable:hover {
  color: #EB5160;
}

.sort-icon {
  font-size: 16px;
  opacity: 0.5;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sort-icon.active {
  opacity: 1;
  color: #EB5160;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background-color: white;
  color: #444;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.pagination-button.active {
  background-color: #EB5160;
  border-color: #EB5160;
  color: white;
  font-weight: 600;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #666;
}

.pagination-info {
  font-size: 14px;
  color: #666;
}

mark {
  background-color: rgba(235, 81, 96, 0.2);
  color: #EB5160;
  padding: 0 2px;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .table-container {
    overflow-x: auto;
  }

  .pagination-container {
    flex-direction: column;
    gap: 12px;
  }

  .pagination {
    justify-content: center;
  }

  .pagination-info {
    text-align: center;
  }
}
</style>