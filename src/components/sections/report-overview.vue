<template>
  <el-row
    v-if="report"
    :gutter="20">
    <el-col :md="16">
      <el-card
        shadow="never"
        class="ms-4">
        <div
          class="report-text"
          v-html="report.description" />
      </el-card>

      <el-card
        v-if="references?.length"
        header="References"
        shadow="never"
        class="ms-4">
        <div
          v-for="reference in references"
          :key="reference.id"
          class="break-all ms-1">
          <reference-inline :reference="reference.text" />
        </div>
      </el-card>

      <el-card
        v-if="attachments?.length"
        header="Media"
        shadow="never"
        class="ms-4">
        <div
          v-for="attachment in attachments"
          :key="attachment.id"
          class="break-all ms-1">
          <attachment-inline :url="attachment.url" />
        </div>
      </el-card>
    </el-col>

    <el-col :md="8">
      <el-card
        shadow="never"
        class="ms-4">
        <table class="definition-table">
          <tbody>
            <tr v-if="report.date">
              <td title="Date of event in local time">Date</td>
              <td :title="report.date_detail">
                {{ date }}
              </td>
            </tr>

            <tr v-if="location.city">
              <td>City</td>
              <td>
                {{ location.city }}
              </td>
            </tr>

            <tr v-if="location.district">
              <td>
                <div>District</div>
              </td>
              <td>
                {{ location.district }}
              </td>
            </tr>

            <tr v-if="location.country">
              <td>Country</td>
              <td>
                {{ location.country }}
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

      <el-card
        shadow="never"
        class="ms-4">
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
            <div
              v-if="copiedLink"
              class="underlined text-gray-10">Copied</div>
            <div
              v-else
              class="underdotted">Copy link</div>
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
import { ElCard, ElRow, ElCol } from 'element-plus';
import { DateTime } from "luxon";
import { onMounted } from "vue";
import iconCopy from "@/assets/icons/copy.svg";
import { sources } from "@/enums";
import Location from '@/models/Location';
import { useLocationsStore } from "@/store/locations";
import { useReportsStore } from "@/store/reports";
let reportsStore = useReportsStore();
let locationsStore = useLocationsStore();

let props = defineProps<{
  id: number;
  references?: string[];
  attachments?: string[];
}>();

defineEmits(["close"]);

let copiedLink = $ref(false);

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

let date = $computed(() => {
  if (!report.date) return "–";
  return DateTime.fromISO(report.date.toString()).toLocaleString(DateTime.DATETIME_SHORT);
});

onMounted(() => {
  locationsStore.fetchLocationDetails([report.location]);
});

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
