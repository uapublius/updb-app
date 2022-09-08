<template>
  <div class="my-4">
    <div class="text-gray-40 ms-1">
      {{ breadcrumbsForUrl(doc.name) }}
    </div>

    <div class="text-green ms-1 lineheight-1 text-large text-bold">
      {{ titleForUrl(doc.name) }}
    </div>

    <div
      v-for="(page, idx) in doc.pages"
      :key="idx"
      class="my-2">
      <a
        :href="hrefForDocResult(doc, page)"
        target="_blank"
        class="mn-1 text-large">Page {{ page }}</a>
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
  let name = doc.name.replace("http://", "https://");

  if (!name.includes('files.afu.se')) {
    name = "https://web.archive.org/web/" + name;
  }

  return name + "#page=" + page;
}

function titleForUrl(url) {
  let parts = url.split("/");
  return parts.pop();
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
