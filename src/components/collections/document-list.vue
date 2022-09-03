<template>
  <div>
    <div class="text-large text-bold ms-3">Search 500,000+ pages of UAP/UFO related documents</div>

    <div class="flex align-items-center ms-2">
      <el-input
        ref="documentSearch"
        v-model="reportKeyword"
        :disabled="isSearching"
        name="documentSearch"
        clearable
        autocomplete="on"
        placeholder="Search all documents"
        @keyup.enter="fetchInitialDocuments" />
      <el-button
        class="mx-2"
        type="primary"
        :disabled="isSearching"
        @click="fetchInitialDocuments">
        Search
      </el-button>
      <div>
        <a
          class="action-link pw-1 nowrap"
          @click="showTips = !showTips">Tips</a>
      </div>
    </div>

    <ul
      v-show="showTips"
      class="tips mn-1">
      <li>• Terms must appear together <strong>on the same page</strong> to match.</li>
      <li>
        • Links will jump to the specific page the term appears in, if your browser supports it.
      </li>
      <li>
        • Results are unranked.
      </li>
      <li>
        • For best results, use maximally specific queries, wrap terms in
        quotes, and use unique words.
      </li>
      <li>
        • For dates, try different formats: e.g. "March 13 1997" or "13th March 1997" or "3/13/1997".
      </li>
      <li>• Similar lexemes are combined; e.g. bounced, bouncing, bounces all return the same results.</li>
      <li>• Diametrics are indexed unaccented: i.e. search for "Bollnas" not "Bollnäs".</li>
      <li>• The "or" search operator is supported.</li>
    </ul>

    <h2 class="text-bold text-gray-50 mn-4">{{ summary }}</h2>

    <div
      v-for="document in documents"
      :key="document.id">
      <el-divider />
      <document-pages-summary :doc="document" />
    </div>

    <div
      v-if="isSearching"
      class="searching my-3">
      Searching...
    </div>

    <div v-if="hasMoreResults && !isSearching">
      <a @click="fetchMoreDocuments">Load more...</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElDivider, ElButton, ElInput } from 'element-plus';
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';

let props = defineProps<{
  pageSize: number;
}>();

let router = useRouter();
let route = useRoute();
let { setPageMeta } = usePageMeta();

let reportKeyword = $ref("");
let summary = $ref("");
let resultsTotal = $ref(null);
let documents = $ref([]);
let isSearching = $ref(null);
let showTips = $ref(false);
let hasMoreResults = $ref(false);
let offset = $ref(0);
let documentSearch = $ref(null);

let title = $computed(() => {
  return summary ? `${summary} | UFO Document Search Engine` : "UFO Document Search Engine | UPDB";
});

let description = 'Search engine for 500,000+ pages of UFO & UAP related documents, indexed using machine learning.';

if (route.query.q) {
  reportKeyword = route.query.q.toString();
  await fetchInitialDocuments();
}

setPageMeta(`${title}`, description);

watch(route, async () => {
  setPageMeta(`${title}`, description);
}, { immediate: true });

async function fetchDocs() {
  try {
    let { data, headers } = await axios.get("/api/docs/rpc/doc_search", {
      params: {
        q: reportKeyword,
        lim: props.pageSize,
        off: offset
      },
      headers: { Prefer: 'count=estimated' }
    });

    resultsTotal = parseInt(headers["content-range"]?.split("/")?.[1]) || 0;
    summary = `${resultsTotal} documents matching “${reportKeyword}”`;

    return data;
  }
  catch (error) {
    console.log(error);
  }
}

async function fetchInitialDocuments() {
  offset = 0;

  isSearching = true;

  router.replace({
    query: {
      ...route.query,
      q: reportKeyword
    }
  });


  let docs = await fetchDocs();
  isSearching = false;
  hasMoreResults = docs.length >= props.pageSize;
  documents = docs;
  offset += props.pageSize;

  setPageMeta(`${title}`, description);
}

async function fetchMoreDocuments() {
  isSearching = true;
  let docs = await fetchDocs();
  isSearching = false;
  hasMoreResults = docs.length >= props.pageSize;
  documents = [...documents, ...docs];
  offset += props.pageSize;
}

</script>
