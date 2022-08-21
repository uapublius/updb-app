<template>
  <el-card
    shadow="never"
    class="ms-3">
    <client-only>
      <report-table @row-selection-changed="rowSelectionChanged" />
    </client-only>
  </el-card>

  <template v-if="selectedReport">
    <el-drawer
      v-model="showDrawer"
      append-to-body
      :with-header="false"
      direction="btt">
      <report-result
        v-bind="selectedReport"
        :always-expanded="true" />
    </el-drawer>
  </template>
</template>

<script setup lang="ts">
import { ElCard, ElDrawer } from 'element-plus';
let selectedReport = $ref(null);
let showDrawer = $ref(false);

function rowSelectionChanged(report) {
  selectedReport = report;
  showDrawer = true;
}
</script>
