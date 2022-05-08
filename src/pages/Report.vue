<template>
  <div class="py-3 px-2">
    <report-detail
      v-if="report?.id"
      :report="report"
      :attachments="attachments"
      :references="references"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject } from "vue";
import { DateTime } from "luxon";
import { loadUrlsForAttachments } from "@/lib/attachments";
import { useRoute, useRouter } from "vue-router";
import { getAttachmentsReferences, getReport } from "@/composables/getReport";
import { baseUrl } from "@/lib/util";

let meta = inject("meta") as HeadTags;
let report = ref({} as Report);
let attachments = ref([]);
let references = ref([]);
let route = useRoute();
let router = useRouter();
let source = route.params.source as string;
let sourceId = route.params.sourceId as string;

let title = computed(() => {
  if (!location.value || !date.value) return "";
  return `${location.value} – ${date.value}`;
});

let description = computed(() => {
  return report.value.description?.trim().substring(0, 180).split(/\n+/).join(" | ") + "...";
});

let location = computed(() => {
  if (!report?.value) return "–";
  let locationFields = ["city", "district", "country", "water", "other"];
  let loc = [];
  for (const locationField of locationFields) {
    if (report.value[locationField]) loc.push(report.value[locationField]);
  }
  return loc.join(", ");
});

let date = computed(() => {
  if (!report?.value.date) return "";
  return DateTime.fromISO(report.value.date).toLocaleString(DateTime.DATETIME_SHORT);
});

function setMeta() {
  meta.title = title.value;
  meta.meta["og:title"] = { content: title.value };
  meta.meta["twitter:title"] = { content: title.value };
  meta.meta["og:url"] = { content: baseUrl + route.path };
  meta.meta["twitter:url"] = { content: baseUrl + route.path };
  meta.meta["description"] = { content: description.value };
}

async function loadReport() {
  report.value = await getReport(parseInt(source), sourceId);
  if (report.value) {
    let res = await getAttachmentsReferences(report.value);
    if (!res) return;
    let [attachmentsRes, referencesRes] = res;
    attachments.value = attachmentsRes.data?.map(a => a.url);
    references.value = referencesRes.data?.map(a => a.text);
    attachments.value = await loadUrlsForAttachments(attachments.value);
  }
}

try {
  await router.isReady();
  await loadReport();
  setMeta();
} catch (error) {
  console.log(error.message);
}
</script>
