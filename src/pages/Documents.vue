<template>
  <div class="p-2 page-documents">
    <h2 class="ms-3">Documents</h2>

    <input type="search" v-model="query" @keyup.enter="search" autofocus placeholder="Search..." />
    <input type="button" @click="search" value="Search" class="mw-2" />

    <div v-if="results?.length" class="my-3">
      {{ results.length }} results
      <div v-for="result in results" class="my-3 result">
        <div class="result-prefix">{{ result.prefix }}</div>
        <div class="result-name">
          <template v-if="result.isPdf">
            {{ result.name }}
          </template>
          <a v-else :href="result.url" target="_blank">{{ result.name }}</a>
        </div>
        <div class="result-links" v-if="result.isPdf">
          <a
            v-for="(page, idx) in result.pages"
            :href="hrefForResultPage(result, page)"
            target="_blank"
          >
            Page {{ page }}
            <template v-if="idx < result.pages.length - 1">·&nbsp;</template>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { inject, onMounted, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
let route = useRoute();
let router = useRouter();
let meta = inject("meta") as HeadTags;

let query = ref("");
let results = ref([]);

async function search() {
  router.push({ path: "documents", query: { q: query.value } });

  let res = await axios.get("/api/docs/document_page", {
    params: {
      order: "document,page",
      select: "document(id,name),page",
      ts: "wfts." + query.value
    }
  });
  let entries = [];

  for (const entry of res.data) {
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

  results.value = entries;
}

if (route.query.q) {
  query.value = route.query.q.toString();
  search();
}

function hrefForResultPage(result, page) {
  let href = result.url;
  if (result.isPdf) href += "#page=" + page;
  return href;
}

function setMeta() {
  let title = "UPDB | Documents";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();

onMounted(async () => {
  setTimeout(() => {
    document.querySelector("input[autofocus]").focus();
  }, 0);
});
</script>

<style scoped>
input[type="search"] {
  font-size: 16px;
}
</style>
