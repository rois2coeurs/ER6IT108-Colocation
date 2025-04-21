<script setup lang="ts">
import Loader from "~/components/Loader.vue";

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
</script>

<template>
  <input type="text" placeholder="Search..." class="search-input" v-model="searchInput"/>
  <Loader v-if="loading" class="center"/>
  <div v-else class="table-container">
    <table>
      <tr class="font-bold">
        <td v-for="(header, index) in Object.keys(sourceDataset[0])" :key="index">
        <span @click="sort(header)" class="sortable">
          <Icon :name="sortIcon(header)"/>
          {{ sourceDatasetHeaders(header) }}
        </span>
        </td>
      </tr>
      <tr v-for="(row, index) in paginatedDataset" :key="index">
        <td v-for="(value, key) in row" :key="key" v-html="highlightMatch(value, searchInput)">
        </td>
      </tr>
    </table>
  </div>
    <div style="text-align: center; padding-top: 10px;">
      <div class="pagination">
        <a v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">
          {{ page }}
        </a>
      </div>
    </div>
    <div style="text-align: end;">
      <span>Page size:</span>
      <select v-model="selectedLimit" @change="currentPage = 1">
        <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
</template>

<style scoped>
.pagination {
  display: inline-block;
}

.pagination a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  border: 1px solid #ddd; /* Gray */
}

.pagination a.active {
  background-color: #da5574;
  color: white;
}

.pagination a:hover:not(.active) {
  background-color: #ddd;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.sortable {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.sortable:hover {
  color: #EB5160FF;
}

table {
  border-collapse: collapse;
  width: 100%;
  overflow: hidden;
}

tr {
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.34);
}

td {
  padding: 8px;
  align-items: center;
}

td:hover {
  background-color: #f1f1f1;
}

tr:last-child {
  border: none;
}

.font-bold {
  font-weight: bold;
}

.table-container {
  max-height: 55vh;
  overflow: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.center {
  top: 50%;
}
</style>