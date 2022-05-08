<template>
  <div class="page-reports px-2 ms-2" :class="{ 'panel-open': panel.open }">
    <client-only>
      <report-table @row-selection-changed="rowSelectionChanged" />
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
import { useRoute, useRouter } from "vue-router";
import qs from "qs";
import { loadUrlsForAttachments } from "@/lib/attachments";
import { baseUrl, object2array } from "@/lib/util";
import { sources } from "@/sources";

let meta = inject("meta") as HeadTags;
let route = useRoute();
let router = useRouter();

let panel = reactive({ open: false, height: 420 });
let report = ref({} as Report);
let attachments = ref([]);
let references = ref([]);
let panelBottom = ref(null);
let title = ref("");

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

async function rowSelectionChanged(reports: Report[]) {
  if (!reports?.length) return;
  await loadReport(reports[0]);
  openPanel();
}

function paramSummary() {
  let filtersParam = route.query.filters ? qs.parse(route.query.filters) : [];
  let filters = object2array(filtersParam);

  if (!filters.length) return "UPDB | All reports";

  let filterStrings = [];
  let locationFilters = {};
  let locationFields = ["city", "district", "country", "water", "other"];
  let allFields = ["source", "date", "description", ...locationFields];
  let dateValue = "";
  let descValue = "";

  for (const allField of allFields) {
    let filter = filters.find(f => f.field === allField);
    if (!filter) continue;
    let field = filter.field;
    let value = filter.value;
    let formattedValue = "";

    if (locationFields.includes(field)) {
      locationFilters[field] = value;
    } else if (field === "date") {
      if (value.length == 1) {
        dateValue = "from " + value;
      } else if (!value[0] && value[1]) {
        dateValue = "to " + value[1];
      } else if (!value[1] && value[0]) {
        dateValue = "from " + value[0];
      } else if (value.length == 2) {
        dateValue = value[0] + "–" + value[1];
      }
    } else if (field === "source") {
      formattedValue = [value]
        .flat()
        .map(s => sources[s])
        .join(", ");
    } else if (field === "description") {
      descValue = `matching &ldquo;${value}&rdquo;`;
    }

    filterStrings.push(formattedValue);
  }

  if (Object.keys(locationFilters).length) {
    let locations = [];
    for (const field of locationFields) {
      if (locationFilters[field]) locations.push(locationFilters[field]);
    }
    filterStrings.push("in " + locations.join(", "));
  }

  let s = "";

  for (let idx = 0; idx < allFields.length; idx++) {
    const filterString = filterStrings[idx];
    if (!filterString) continue;
    s += filterString + " ";
  }

  s += dateValue;
  s += descValue;

  // s = capitalize(s);
  return "Reports " + s;
}

function setMeta() {
  title.value = paramSummary();
  meta.title = title.value;
  meta.meta["og:title"] = { content: title.value };
  meta.meta["twitter:title"] = { content: title.value };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

try {
  await router.isReady();
  setMeta();
} catch (error) {
  console.log(error.message);
}
</script>
