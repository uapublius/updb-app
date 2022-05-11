<template>
  <div class="py-1 px-2">
    <h2 class="mn-3 ms-1">
      <a href="/reports">Reports →</a>
    </h2>
    <div>Find UAP/UFO reports near you, including tic-tacs, orbs, triangles & saucers.</div>

    <h2 class="mn-3 ms-1">
      <a href="/documents">Documents →</a>
    </h2>
    <div>Search inside UAP/UFO articles, newsletters, magazines & other documents.</div>

    <h2 class="mn-3 ms-1">
      <a href="/news">News →</a>
    </h2>
    <div>Project changelog and newsletter signup.</div>

    <h2 class="mn-3 ms-1">
      <a href="/about">About →</a>
    </h2>
    <div>More information about the project.</div>

    <h2 class="mn-3 ms-1">
      <a href="/sources">Sources →</a>
    </h2>
    <div>Details about the sources and providers used for the database.</div>

    <h2 class="mn-3 ms-1">
      <a href="/download">Download →</a>
    </h2>
    <div>Download the raw data in postgreSQL format.</div>

    <div class="mn-5 inline-block">
      <samford-quote />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();
let meta = inject("meta") as HeadTags;

function setMeta() {
  let title = "UPDB | Home";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();
</script>
