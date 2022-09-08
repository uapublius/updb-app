<template>
  <div>
    <h2 class="ms-3">{{ name }}</h2>
    <div
      v-for="country in reportsStore.reportCountsByContinent[abbreviation]"
      :key="country.name">
      <div class="ms-2">
        <h3
          class="ms-1"
          itemprop="location"
          itemscope
          itemtype="https://schema.org/Place">
          <span
            itemprop="address"
            itemscope
            itemtype="https://schema.org/PostalAddress">
            {{ country.emoji }}&nbsp;<a :href="`/reports/country/${country.abbreviation}`">
              <span itemprop="addressCountry">{{ country.name }}</span>
              <template v-if="country.name !== country.native"> ({{ country.native }})</template>
              – {{ country.count }} reports</a>
          </span>
        </h3>
        <span
          v-if="['US', 'CA'].includes(country.abbreviation)"
          class="bulleted">
          <span
            v-for="province in provinces.filter(p => p.country === country.abbreviation)"
            :key="province.name"
            itemprop="location"
            itemscope
            itemtype="https://schema.org/Place">
            <span
              itemprop="address"
              itemscope
              itemtype="https://schema.org/PostalAddress">
              <a :href="`/reports/country/${country.abbreviation}/${province.name.replaceAll(' ', '_')}`"><span itemprop="addressRegion">{{ province.name }}</span>
                <template v-if="province.alt?.length"> ({{ province.alt[0] }})</template>
              </a>
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import provinces from "provinces";
import { useReportsStore } from "@/store/reports";
let reportsStore = useReportsStore();

defineProps<{
  name?: string;
  abbreviation?: string;
}>();
</script>
