<template>
  <el-autocomplete
    :debounce="0"
    :fetch-suggestions="querySearchDistrict"
    :trigger-on-focus="false"
    value-key="name"
    highlight-first-item
    clearable
    name="district"
    placeholder="State/Province/District"
    size="large" />
</template>


<script setup lang="ts">
import { ElAutocomplete } from 'element-plus';
import provinces from "provinces";

let props = defineProps<{
  country?: string;
}>();

let provincesForCountry = $computed(() => {
  return provinces.filter(p => {
    return p.country === props.country;
  });
});

function querySearchDistrict(queryString: string, cb: (arg: any) => void) {
  queryString = queryString.toLowerCase();
  
  let prc = provincesForCountry.filter(p => {
    return p.name.toLowerCase().includes(queryString);
  });

  prc = prc.sort((a, b) => {
    return a.name < b.name ? -1 : 1;
  });

  cb(prc);
}
</script>  