<template>
  <div class="page-reports px-2 ms-2" :class="{ 'panel-open': panel.open }">
    <client-only>
      <report-table @row-selection-changed="handleRowSelectionChanged" />
    </client-only>

    <div ref="panelBottom" v-show="panel.open" class="panel-bottom">
      <div class="py-2 px-2">
        <client-only>
          <report-detail :report="report" :attachments="attachments" :references="references">
            <a class="icon-close" @click="panel.open = false">
              <icon name="chevron-down" />
            </a>
          </report-detail>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from "vue";
import { loadUrlsForAttachments } from "@/lib/attachments";

let meta = inject('meta') as HeadTags;
let panel = reactive({ open: false, height: 420 });
let report = ref({} as Report);
let attachments = ref([]);
let references = ref([]);
let panelBottom = ref(null);

async function loadReport(selectedReport) {
  report.value = selectedReport;
  attachments.value = report.value.attachments || [];
  references.value = report.value.references || [];
  attachments.value = await loadUrlsForAttachments(attachments.value);
}

function openPanel() {
  panelBottom.scrollTop = 0;
  panel.open = true;
}

async function handleRowSelectionChanged(reports: Report[]) {
  if (!reports?.length) return;
  await loadReport(reports[0]);
  openPanel();
}

meta.title = 'UPDB | Reports';
</script>
