<template>
  <el-header
    height="auto"
    class="flex align-items-center p-4">
    <h2 class="me-3">Reports</h2>
    <!--
    <el-radio-group
      :model-value="route.name.toString()"
      @change="changeView">
      <el-radio-button
        name="ReportsList"
        label="ReportsList">
        List
      </el-radio-button>
      <el-radio-button
        name="ReportsTable"
        label="ReportsTable">
        Table
      </el-radio-button>
    </el-radio-group> -->
  </el-header>

  <el-main class="px-4">
    <router-view />
  </el-main>
</template>

<script setup lang="ts">
import {
 ElHeader, ElMain, ElRadioGroup, ElRadioButton
} from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

let router = useRouter();
let route = useRoute();

function changeView(val) {
  router.push({
    name: val,
    query: {
      ...route.query
    }
  });
}
</script>
