<template>
  <div>
    <div class="flex align-items-center ms-2">
      <el-input
        v-model="reportsStore.keyword"
        :disabled="disabled"
        name="keyword"
        autocomplete="on"
        clearable
        size="large"
        placeholder="Keywords"
        class="up-input me-2"
        @keyup.enter="emit('search')" />
      <client-only>
        <el-tooltip
          content="Top center"
          placement="top">
          <template #content>
            <div
              class="block text-gray-60">
              <div>• Similar lexemes are combined; e.g. bounced, bouncing, bounces all return the same results.</div>
              <div>• Diametrics are indexed unaccented: i.e. search for "Leon" not "León".</div>
              <div>• The "OR" search operator is supported.</div>
            </div>
          </template>
          <icon-info-circle class="text-gray-50" />
        </el-tooltip>
      </client-only>
    </div>

    <div class="flex align-items-center ms-2">
      <div class="report-filters-location flex me-2">
        <el-input
          v-model="reportsStore.location.city"
          :disabled="disabled"
          name="city"
          class="up-input me-2"
          placeholder="City"
          autocomplete="on"
          clearable
          size="large"
          @keyup.enter="emit('search')" />

        <el-input
          v-model="reportsStore.location.district"
          :disabled="disabled"
          name="district"
          class="up-input me-2"
          placeholder="District"
          autocomplete="on"
          clearable
          size="large"
          @keyup.enter="emit('search')" />

        <el-input
          v-model="reportsStore.location.country"
          :disabled="disabled"
          name="country"
          class="up-input me-2"
          placeholder="Country"
          autocomplete="on"
          clearable
          maxlength="2"
          size="large"
          @keyup.enter="emit('search')" />

        <el-input
          v-model="reportsStore.location.water"
          :disabled="disabled"
          name="water"
          class="up-input me-2"
          placeholder="Water"
          autocomplete="on"
          clearable
          size="large"
          @keyup.enter="emit('search')" />

        <el-input
          v-model="reportsStore.location.other"
          :disabled="disabled"
          name="other"
          class="up-input"
          placeholder="Other"
          autocomplete="on"
          clearable
          size="large"
          @keyup.enter="emit('search')" />
      </div>

      <div>
        <client-only>
          <el-tooltip
            content="Top center"
            placement="top">
            <template #content>
              <div
                class="block text-gray-60">
                <div>• Location fields are case-insensitive.</div>
                <div>• Use 2-letter country code, e.g. GB for Great Britain.</div>
              </div>
            </template>
            <icon-info-circle class="text-gray-50" />
          </el-tooltip>
        </client-only>
      </div>
    </div>

    <div class="flex align-items-center ms-2">
      <div class="flex flex-grow me-2">
        <el-input
          v-model="reportsStore.from"
          :disabled="disabled"
          name="from"
          class="up-input me-2"
          placeholder="Date From"
          autocomplete="on"
          clearable
          size="large"
          @keyup.enter="emit('search')" />

        <el-input
          v-model="reportsStore.to"
          :disabled="disabled"
          name="to"
          class="up-input"
          placeholder="Date To"
          autocomplete="on"
          clearable
          size="large"
          @keyup.enter="emit('search')" />
      </div>

      <div>
        <client-only>
          <el-tooltip
            content="Top center"
            placement="top">
            <template #content>
              <div
                class="block text-gray-60">
                <div>• Multiple date formats are supported e.g. 6/26/1947 or June 26 1947.</div>
              </div>
            </template>
            <icon-info-circle class="text-gray-50" />
          </el-tooltip>
        </client-only>
      </div>
    </div>

    <el-button
      :disabled="disabled"
      class="block w-100 text-larger py-0"
      type="primary"
      size="large"
      @click="emit('search')">
      Search
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ElInput, ElButton, ElTooltip } from 'element-plus';
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useReportsStore } from "@/store/reports";
let reportsStore = useReportsStore();
let route = useRoute();


let emit = defineEmits(['search']);
let props = defineProps<{
  disabled?: boolean;
}>();

</script>
