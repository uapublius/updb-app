<template>
  <el-select
    name="water"
    :remote-method="v => filterWaterKeyword = v"
    remote
    filterable
    clearable
    default-first-option
    fit-input-width
    placeholder="Water Body"
    size="large">
    <el-option v-for="item in filteredWater" :key="item" :value="item" />
  </el-select>
</template>

<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus';
import waterBodies from "@/lib/water-bodies";

let filterWaterKeyword = $ref('');

let filteredWater = $computed(() => {
  return [...waterBodies.values()].filter((c => {
    let ll = c.toLowerCase();
    return ll.includes(filterWaterKeyword.toLowerCase());
  }));
});
</script>  