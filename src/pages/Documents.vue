<template>
  <div class="p-2 max-width">
    <h2 class="ms-1">Documents</h2>
    <div class="ms-3">Search 500,000+ pages of UAP/UFO related documents.</div>

    <div class="search-box flex align-items-center my-2">
      <input type="search" class="flex-grow" v-model="query" @keyup.enter="search" autofocus placeholder="Search..."
        :disabled="isSearching" />
      <input type="button" @click="search" value="Search" class="mw-2" :disabled="isSearching" />
      <div>
        <a @click="showTips = !showTips" class="action-link mw-2">Tips</a>
      </div>
    </div>

    <ul v-show="showTips" class="tips mn-1">
      <li>
        Results are unranked. For best results, use maximally specific queries, wrap terms in
        quotes, and use unique words.
      </li>
      <li>
        For dates, try different formats: e.g. "March 13 1997" or "13th March 1997" or "3/13/1997".
      </li>
      <li>Similar lexemes are combined; e.g. bounced, bouncing, bounces.</li>
      <li>Diametrics are indexed unaccented: i.e. search for "Bollnas" not "Bollnäs".</li>
      <li>The "or" search operator is supported.</li>
    </ul>

    <ul class="tips mn-1">
      <li>Terms must appear together on the same page to match.</li>
      <li>
        Links will jump to the specific page the term appears in, if your browser supports it.
      </li>
    </ul>

    <div v-if="isSearching" class="searching my-3">Searching...</div>

    <div v-else class="results">
      <div v-if="results?.length" class="my-3">
        <strong>{{ count }}</strong>
        pages found in
        <strong>{{ results.length }}</strong>
        documents.

        <div v-for="result in results" class="my-3 result">
          <div class="result-prefix">{{ result.prefix }}</div>
          <div class="result-name">
            <template v-if="result.isPdf">
              {{ result.name }}
            </template>
            <a v-else :href="result.url" target="_blank">{{ result.name }}</a>
          </div>
          <div class="result-links" v-if="result.isPdf">
            <a v-for="(page, idx) in result.pages" :href="hrefForResultPage(result, page)" target="_blank">
              Page {{ page }}
              <template v-if="idx < result.pages.length - 1">·&nbsp;</template>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { inject, onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
let route = useRoute();
let router = useRouter();
let meta = inject("meta") as HeadTags;

let query = ref("");
let results = ref([]);
let isSearching = ref(false);
let showTips = ref(false);

async function search() {
  router.push({ path: "documents", query: { q: query.value } });

  isSearching.value = true;

  let res;

  try {
    res = await axios.get("/api/docs/document_page", {
      params: {
        order: "document,page",
        select: "document(id,name),page",
        ts: "wfts." + query.value
      }
    });
  } catch (error) {
    console.log(error);
    return;
  } finally {
    isSearching.value = false;
  }

  let entries = entriesFromRes(res.data);

  results.value = entries;
}

function entriesFromRes(data) {
  let entries = [];

  for (const entry of data) {
    let candidateEntry = entries.find(p => p.id === entry.document.id);
    let newEntry = false;

    if (!candidateEntry) {
      newEntry = true;

      let parts = entry.document.name.split("/");
      candidateEntry = {
        id: entry.document.id,
        url: entry.document.name,
        name: parts.pop(),
        prefix: parts
          .join("/")
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "")
          .replace(/\//g, " › "),
        pages: [],
        isPdf: false
      };

      candidateEntry.isPdf = candidateEntry.name.toLowerCase().endsWith(".pdf");
    }

    candidateEntry.pages.push(entry.page);
    if (newEntry) entries.push(candidateEntry);
  }

  return entries;
}

let count = computed(() => {
  return results.value.reduce((acc, curr) => {
    acc += curr.pages.length;
    return acc;
  }, 0);
});

if (route.query.q) {
  query.value = route.query.q.toString();
  search();
}

function hrefForResultPage(result, page) {
  let href = result.url;
  if (result.isPdf) href += "#page=" + page;
  return href;
}

function querySummary() {
  if (!route.query.q) return "";
  let value = route.query.q.toString();
  return ` matching “${value}”`;
}

function setMeta() {
  let title = "UPDB | Documents" + querySummary();
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

onMounted(async () => {
  setMeta();
  setTimeout(() => {
    (document.querySelector("input[autofocus]") as HTMLInputElement).focus();
  }, 0);
});

try {
  setMeta();
  await router.isReady();
  setMeta();
} catch (error) {
  console.log(error.message);
}
</script>

<style scoped>
.search-box {
  width: 460px;
}

input[type="search"] {
  font-size: 16px;
}

.tips {
  font-size: 12px;
}
</style>
