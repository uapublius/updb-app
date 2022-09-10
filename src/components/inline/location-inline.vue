<template>
  <span class="location-inline">
    <span itemprop="name" />
    <template v-if="showCount">({{ count }}) </template>
    <span
      itemprop="address"
      itemscope
      itemtype="https://schema.org/PostalAddress"
      v-html="summary" />
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
    if (location[locationField]) {
      let val = `${location[locationField]}`;
      if (locationField === 'city') defined.push(`<span itemprop="addressLocality">${val}</span>`);
      else if (locationField === 'district') defined.push(`<span itemprop="addressRegion">${val}</span>`);
      else if (locationField === 'country') defined.push(`<span itemprop="addressCountry">${val}</span>`);
      else defined.push(val);
    }
  }

  if (!defined.length) return props.id;

  return defined.join(", ");
});
</script>
