<template>
  <el-header height="auto" class="flex align-items-center p-4">
    <h1 class="me-3">UFO Reports by Country</h1>
  </el-header>

  <el-main class="px-4">
    <el-row :gutter="20">
      <el-col :md="12">
        <el-card shadow="never" class="ms-3">
          <continent-summary name="North America" abbreviation="NA" />
        </el-card>

        <el-card shadow="never" class="ms-3">
          <continent-summary name="South America" abbreviation="SA" />
        </el-card>

        <el-card shadow="never" class="ms-3">
          <continent-summary name="Asia" abbreviation="AS" />
        </el-card>

        <el-card shadow="never" class="ms-3">
          <continent-summary name="Antarctica" abbreviation="AN" />
        </el-card>

        <!-- <el-card
          shadow="never"
          class="ms-3">
          <continent-summary
            name="Unknown"
            abbreviation="unknown" />
        </el-card> -->
      </el-col>

      <el-col :md="12">
        <el-card shadow="never" class="ms-3">
          <continent-summary name="Europe" abbreviation="EU" />
        </el-card>

        <el-card shadow="never" class="ms-3">
          <continent-summary name="Australia" abbreviation="OC" />
        </el-card>

        <el-card shadow="never" class="ms-3">
          <continent-summary name="Africa" abbreviation="AF" />
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup lang="ts">
import {
  ElHeader, ElMain, ElCard, ElRow, ElCol
} from 'element-plus';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';
import { useReportsStore } from "@/store/reports";

let reportsStore = useReportsStore();
let { setPageMeta } = usePageMeta();
let route = useRoute();

let title = "UFO Reports by Country | UPDB";
let description = "UFO Reports in Europe, Asia, North & South America, Australia, Africa, and Antarctica";

setPageMeta(title, description);

watch(route, () => {
  setPageMeta(title, description);
}, { immediate: true });

try {
  await reportsStore.fetchReportCountryCounts();
  setPageMeta(title, description);
}
catch (error) {
  console.error(error.message);
}
</script>
