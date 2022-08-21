<template>
  <client-only>
    <tabulator
      :filters="[]"
      :sort="[]"
      :columns="columns"
      url="/api/reports/location"
      count="exact"
      :options="options" />
  </client-only>
</template>

<script setup lang="ts">
import { locationColumns } from "@/composables/useTabulator/columns/locationColumns";

let columns = $ref([
  locationColumns
]);

let options = $ref({
  paginationSize: 20
});
</script>
