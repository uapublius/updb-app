<template>
  <div class="my-4">
    <div class="text-gray-50 ms-1">
      {{ breadcrumbsForUrl(doc.name) }}
    </div>

    <h4 class="ms-2">
      {{ titleForUrl(doc.name) }}
    </h4>

    <div
      v-for="(page, idx) in doc.pages"
      :key="idx"
      class="my-1">
      <a
        :href="hrefForDocResult(doc, page)"
        target="_blank"
        class="mn-1">Page {{ page }}</a>
      <div
        class="snippet"
        v-html="doc.text[idx]" />
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
