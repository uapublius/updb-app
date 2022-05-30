<template>
  <div class="result mn-4 ms-4">
    <div class="result-prefix">
      {{ breadcrumbsForUrl(doc.name) }}
    </div>

    <div class="result-title">
      {{ titleForUrl(doc.name) }}
    </div>

    <div v-for="(page, idx) in doc.pages" class="my-1">
      <a :href="hrefForDocResult(doc, page)" target="_blank">Page {{ page }}</a>
      <div class="snippet" v-html="doc.text[idx]" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  doc: any;
}>();

function hrefForDocResult(doc, page) {
  return doc.name.replace("http://", "https://") + "#page=" + page;
}

function titleForUrl(url) {
  let parts = url.split("/");
  return parts.pop().replace(".pdf", "");
}

function breadcrumbsForUrl(url) {
  let parts = url.split("/");
  parts.pop();

  return parts
    .join("/")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/\//g, " › ");
}
</script>
