<template>
  <div class="py-3 px-2">
    <report-detail v-if="report?.id" :report="report" :attachments="attachments" :references="references" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DateTime } from "luxon";
import { loadUrlsForAttachments } from '@/lib/attachments';
import { useRoute, useRouter } from "vue-router";
import { getAttachmentsReferences, getReport } from "@/composables/getReport";
import { inject } from 'vue';

let meta = inject('meta') as HeadTags;
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

let location = computed(() => {
  if (!report?.value) return "–";
  let loc = [report.value.city, report.value.district, report.value.country];
  return loc.join(', ');
});

let date = computed(() => {
  if (!report?.value.date) return "";
  return DateTime.fromISO(report.value.date).toLocaleString(DateTime.DATETIME_SHORT);
});

function setmeta() {
  meta.meta['og:title'] = { content: title };
  meta.meta['twitter:title'] = { content: title };
  meta.meta['og:url'] = { content: import.meta.env.VITE_DOMAIN + route.path };
  meta.meta['twitter:url'] = { content: import.meta.env.VITE_DOMAIN + route.path };
  meta.title = title.value;
}

async function loadReport() {
  report.value = await getReport(parseInt(source), sourceId);
  if (report.value) {
    let [attachmentsRes, referencesRes] = await getAttachmentsReferences(report.value);
    attachments.value = attachmentsRes.data?.map(a => a.url);
    references.value = referencesRes.data?.map(a => a.text);
    attachments.value = await loadUrlsForAttachments(attachments.value);
  }
}

await router.isReady();
loadReport();
setmeta();
</script>
