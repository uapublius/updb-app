<template>
  <div>
    <div class="ms-3">
      <div class="flex align-items-center ms-2">
        <el-input
          v-model="filtersStore.keyword"
          :disabled="searching"
          name="keyword"
          autocomplete="on"
          clearable
          size="large"
          placeholder="Keywords"
          class="up-input me-2"
          @keyup.enter="emit('search')" />
        <client-only>
          <el-tooltip content="Top center" placement="top">
            <template #content>
              <div class="block text-gray-60">
                <div>• Similar lexemes are combined; e.g. bounced, bouncing, bounces all return the same results.</div>
                <div>• Diametrics are indexed unaccented: i.e. search for "Leon" not "León".</div>
                <div>• The "OR" search operator is supported.</div>
                <div>• Use quotes around words to search for an exact phrase.</div>
              </div>
            </template>
            <icon-info-circle class="text-gray-50" />
          </el-tooltip>
        </client-only>
      </div>

      <div class="flex align-items-center ms-2">
        <div class="report-filters-location flex me-2">
          <el-input
            v-model="filtersStore.location.city"
            :disabled="searching"
            name="city"
            class="up-input me-2"
            placeholder="City"
            autocomplete="on"
            clearable
            size="large"
            @keyup.enter="emit('search')" />

          <el-input
            v-model="filtersStore.location.district"
            :disabled="searching"
            name="district"
            class="up-input me-2"
            placeholder="District"
            autocomplete="on"
            clearable
            size="large"
            @keyup.enter="emit('search')" />

          <el-input
            v-model="filtersStore.location.country"
            :disabled="searching"
            name="country"
            class="up-input me-2"
            placeholder="Country"
            autocomplete="on"
            clearable
            maxlength="2"
            size="large"
            @keyup.enter="emit('search')" />

          <el-input
            v-model="filtersStore.location.water"
            :disabled="searching"
            name="water"
            class="up-input"
            placeholder="Water"
            autocomplete="on"
            clearable
            size="large"
            @keyup.enter="emit('search')" />

        <!-- <el-input
          v-model="filtersStore.location.other"
          :disabled="searching"
          name="other"
          class="up-input"
          placeholder="Other"
          autocomplete="on"
          clearable
          size="large"
          @keyup.enter="emit('search')" /> -->
        </div>

        <div>
          <client-only>
            <el-tooltip content="Top center" placement="top">
              <template #content>
                <div class="block text-gray-60">
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
            v-model="filtersStore.from"
            :disabled="searching"
            name="from"
            class="up-input me-2"
            placeholder="Date From"
            autocomplete="on"
            clearable
            size="large"
            @keyup.enter="emit('search')" />

          <el-input
            v-model="filtersStore.to"
            :disabled="searching"
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
            <el-tooltip content="Top center" placement="top">
              <template #content>
                <div class="block text-gray-60">
                  <div>• Multiple date formats are supported e.g. 6/26/1947 or June 26 1947.</div>
                </div>
              </template>
              <icon-info-circle class="text-gray-50" />
            </el-tooltip>
          </client-only>
        </div>
      </div>

      <div class="flex align-items-center justify-content-between ms-2">
        <client-only>
          <el-select
            v-model="filtersStore.source"
            multiple
            size="large"
            class="up-input me-2"
            value-key="id"
            placeholder="Source">
            <el-option
              v-for="source in filtersStore.sources"
              :key="source.id"
              :label="sources[source.id]"
              :value="source" />
          </el-select>
        </client-only>

        <el-input-number
          v-model="filtersStore.minWords"
          controls-position="right"
          :step="100"
          size="large"
          class="up-input"
          placeholder="Min Words" />

        <div class="text-right flex-grow">
          <el-button text type="primary" @click="filtersStore.resetFilters">Reset</el-button>
        </div>
      </div>

      <el-button
        :disabled="searching || !filtersStore.hasFilter"
        :loading="searching"
        class="w-100 text-larger py-0"
        type="primary"
        size="large"
        @click="emit('search')">
        Search
      </el-button>
    </div>

    <div class="text-small text-gray-50">
      <div class="text-bold">Examples</div>
      <a @click="thisYear">This Year</a> •
      <a @click="dateRange">Date range</a> •
      <a @click="exactPhrase">Exact phrase</a> •
      <a @click="longMentioningOrb">Long orb reports</a> •
      <a @click="veterans">Veterans</a> •
      <a @click="skinwalkerSounds">Skinwalker sounds</a> •
      <a @click="campingInOregon">Camping in Oregon</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ElSelect, ElOption, ElInput, ElInputNumber, ElButton, ElTooltip
} from 'element-plus';
import { sources } from "@/enums";
import { useFiltersStore } from "@/store/filters";

let filtersStore = useFiltersStore();

let emit = defineEmits(['search']);

defineProps<{
  searching?: boolean;
}>();

function thisYear() {
  filtersStore.resetFilters();
  let now = new Date();
  filtersStore.from = now.getFullYear();
  emit('search');
}

function longMentioningOrb() {
  filtersStore.resetFilters();
  let now = new Date();
  filtersStore.from = now.getFullYear() - 10;
  filtersStore.minWords = 500;
  filtersStore.keyword = "orb";
  emit('search');
}

function veterans() {
  filtersStore.resetFilters();
  filtersStore.keyword = "army veteran OR navy veteran OR marine veteran OR air force veteran";
  emit('search');
}

function skinwalkerSounds() {
  filtersStore.resetFilters();
  filtersStore.keyword = "hear OR sound";
  filtersStore.setSource("Skinwalker");
  emit('search');
}

function campingInOregon() {
  filtersStore.resetFilters();
  filtersStore.keyword = "camping";
  filtersStore.location.district = "Oregon";
  filtersStore.location.country = "US";
  emit('search');
}

function historical() {
  filtersStore.resetFilters();
  filtersStore.to = 1970;
  filtersStore.setSource("UFODNA");
  filtersStore.minWords = 100;
  emit('search');
}

function dateRange() {
  filtersStore.resetFilters();
  filtersStore.from = "March 1 1947";
  filtersStore.to = "October 1 1947";
  emit('search');
}

function exactPhrase() {
  filtersStore.resetFilters();
  filtersStore.keyword = '"incredibly high speed"';
  emit('search');
}
</script>
