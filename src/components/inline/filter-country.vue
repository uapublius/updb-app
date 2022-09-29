<template>
  <el-select
    name="country"
    :remote-method="v => filterCountryKeyword = v"
    remote
    filterable
    clearable
    value-key="abbreviation"
    default-first-option
    placeholder="Country"
    size="large">
    <el-option
      v-for="item in filteredCountries"
      :key="item.abbreviation"
      :label="`${item.emoji}  ${item.name}`"
      :value="item.abbreviation">
      <span class="flex align-items-center">
        <span class="text-largest pe-2">{{ item.emoji }}</span>
        <span class="text-large">{{ item.name }}</span>
      </span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
  import { countries } from "countries-list";
  import { ElSelect, ElOption } from 'element-plus';

  let countryList = $computed(() => {
    let cn = Object.entries(countries)
      .map(([abbr, country]) => {
        return {
          abbreviation: abbr,
          ...country
        };
      })
      .sort((a, b) => a.name > b.name ? 1 : -1);

    return cn;
  });

  let filteredCountries = $computed(() => {
    return countryList.filter((c => {
      let lc = c.abbreviation?.toLowerCase();
      let ll = c.name?.toLowerCase();
      return lc.includes(filterCountryKeyword.toLowerCase()) || ll.includes(filterCountryKeyword.toLowerCase());
    }));
  });

  let filterCountryKeyword = $ref('');
</script>  