<template>
  <span class="location-inline">
    <template v-if="showCount">({{ count }}) </template>{{ summary }}
  </span>
</template>

<script setup lang="ts">
import { useLocationsStore } from "@/store/locations";
let locationsStore = useLocationsStore();

let props = defineProps<{
  id?: number;
  showCount?: boolean;
}>();

let location = $computed(() => {
  return locationsStore.details[props.id] || {};
});

let count = $computed(() => {
  return locationsStore.counts[props.id] || {};
});

let summary = $computed(() => {
  let fields = ["city", "district", "country", "water", "other"];
  let defined = [];

  for (const locationField of fields) {
    if (location[locationField]) defined.push(location[locationField]);
  }

  if (!defined.length) return props.id;

  return defined.join(", ");
});
</script>
