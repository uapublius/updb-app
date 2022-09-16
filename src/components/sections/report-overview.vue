<template>
  <el-row
    v-if="report"
    itemscope
    itemtype="https://schema.org/Event"
    :gutter="20">
    <el-col :md="16">
      <div class="flex flex-column">
        <el-card
          v-if="attachments?.length"
          shadow="never"
          class="card-report-attachments ms-4">
          <template #header>
            <div class="flex justify-content-between">
              <div>Media</div>
              <client-only>
                <el-popover
                  placement="auto"
                  :width="200"
                  trigger="hover">
                  <template #reference>
                    <el-button size="small" :icon="Picture">Filter</el-button>
                  </template>
                  <div>
                    <el-radio-group v-model="videoFilter">
                      <el-radio label="">Original</el-radio>
                      <el-radio label="soft-light">Exposure</el-radio>
                      <el-radio label="plus-lighter">Brightness</el-radio>
                      <el-radio label="difference">Difference</el-radio>
                    </el-radio-group>

                    <el-slider
                      v-if="videoFilter"
                      v-model="videoFilterAmount"
                      label="Amount"
                      class="mn-1" />
                  </div>
                </el-popover>
              </client-only>
            </div>
          </template>

          <div v-for="attachment in attachments" :key="attachment.id" class="break-all mn-3">
            <attachment-inline
              :report="report"
              :url="attachment.url"
              :video-filter="videoFilter"
              :video-filter-amount="videoFilterAmount" />
          </div>
        </el-card>

        <el-card shadow="never" class="card-report-description ms-4" :body-style="{ 'padding': '0' }">
          <div class="report-text text-large p-3" v-html="report.description" />
        </el-card>

        <el-card
          v-if="references?.length"
          header="References"
          shadow="never"
          class="card-report-references ms-4">
          <div v-for="reference in references" :key="reference.id" class="break-all ms-1">
            <reference-inline :reference="reference.text" />
          </div>
        </el-card>
      </div>
    </el-col>

    <el-col :md="8">
      <el-card
        shadow="never"
        class="ms-4"
        itemprop="location"
        itemscope
        itemtype="https://schema.org/Place">
        <table
          class="definition-table text-larger"
          itemprop="address"
          itemscope
          itemtype="https://schema.org/PostalAddress">
          <tbody>
            <tr v-if="location.city">
              <td>City</td>
              <td>
                <span itemprop="addressLocality">{{ location.city }}</span>
              </td>
            </tr>

            <tr v-if="location.district">
              <td>
                <div>District</div>
              </td>
              <td>
                <span itemprop="addressRegion">{{ location.district }}</span>
              </td>
            </tr>

            <tr v-if="location.country">
              <td>Country</td>
              <td>
                <span itemprop="addressCountry">{{ location.country }}</span>
              </td>
            </tr>

            <tr v-if="location.water">
              <td>Water</td>
              <td>
                {{ location.water }}
              </td>
            </tr>

            <tr v-if="location.other">
              <td>Other</td>
              <td>
                {{ location.other }}
              </td>
            </tr>
          </tbody>
        </table>
      </el-card>

      <el-card shadow="never" class="ms-4">
        <table class="definition-table text-larger">
          <tbody>
            <tr v-if="report.date">
              <td title="Date of event in local time">Date</td>
              <td :title="report.date_detail">
                <date-inline
                  itemprop="startDate"
                  :datetime="report.date"
                  :date="report.date"
                  format="DATETIME_SHORT" />
              </td>
            </tr>
          </tbody>
        </table>
      </el-card>

      <el-card shadow="never" class="ms-4">
        <table itemprop="name" class="definition-table text-larger">
          <tbody>
            <tr v-if="source">
              <td>Source</td>
              <td>
                {{ source }}
              </td>
            </tr>
            <tr v-if="source">
              <td>Source ID</td>
              <td>
                {{ report.source_id }}
              </td>
            </tr>
          </tbody>
        </table>
      </el-card>

      <el-card header="Tags" shadow="never" class="ms-4">
        <client-only>
          <report-tags :report="report" />
        </client-only>
      </el-card>

      <el-card shadow="never" class="ms-4 text-larger">
        <client-only>
          <a
            class="action-link flex align-items-center ms-2"
            :href="permalink"
            target="_blank"
            title="Open report in new window">
            <icon-link />
            <div class="underdotted">Permalink</div>
          </a>

          <a
            class="action-link flex align-items-center ms-2"
            target="_blank"
            title="Copy permalink"
            @click="copyLink">
            <icon-copy />
            <div v-if="copiedLink" class="underlined text-gray-10">Copied</div>
            <div v-else class="underdotted">Copy link</div>
          </a>

          <a
            class="action-link flex align-items-center"
            :href="tweetUrl"
            title="Tweet report"
            target="_blank">
            <icon-twitter />
            <div class="underdotted">Tweet</div>
          </a>
        </client-only>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue';
import {
 ElCard, ElRow, ElCol, ElSlider, ElPopover, ElRadio, ElRadioGroup, ElButton
} from 'element-plus';
import ReportTags from '../collections/report-tags.vue';
import iconCopy from "@/assets/icons/copy.svg";
import { sources } from "@/enums";
import Location from '@/models/Location';
import { useLocationsStore } from "@/store/locations";
import { useReportsStore } from "@/store/reports";
let reportsStore = useReportsStore();
let locationsStore = useLocationsStore();

let props = defineProps<{
  id: number;
}>();

defineEmits(["close"]);

let copiedLink = $ref(false);
let videoFilter = $ref("");
let videoFilterAmount = $ref(50);

let report = $computed(() => {
  return reportsStore.formattedReport(props.id);
});

let references = $computed(() => {
  return reportsStore.referencesForReport(props.id);
});

let attachments = $computed(() => {
  return reportsStore.attachmentsForReport(props.id);
});

let location = $computed(() => {
  return locationsStore.details[report.location] || {} as Location;
});

let source = $computed(() => {
  return sources[report.source];
});

let permalink = $computed(() => {
  return `https://updb.app/report/${report.source}-${report.source_id}`;
});

try {
  await locationsStore.fetchLocationDetails([report.location]);
}
catch (error) {
  console.error(error);
}

let tweetUrl = $computed(() => {
  const myUrlWithParams = new URL("https://twitter.com/intent/tweet");

  myUrlWithParams.searchParams.append("text", `${source} ${report.source_id}`);
  myUrlWithParams.searchParams.append("url", permalink);
  myUrlWithParams.searchParams.append("hashtags", "UFOTwitter");

  return myUrlWithParams.href;
});

async function copyLink() {
  copiedLink = true;
  await navigator.clipboard.writeText(permalink);
  setTimeout(() => {
    copiedLink = false;
  }, 3000);
}
</script>

<style scoped>
  .card-report-attachments {
    order: 3;
  }
  .card-report-description {
    order: 1;
  }
  .card-report-references {
    order: 2;
  }
</style>