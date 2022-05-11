<template>
  <div class="p-2">
    <h2 class="ms-3">News</h2>

    <client-only>
      <newsletter />
    </client-only>

    <h3 class="mn-3 ms-2">Changelog</h3>

    <div>1652031380</div>
    <ul class="ms-2">
      <li>Add: BAASS source</li>
      <li>Add: NIDS source</li>
      <li>Add: BLUEBOOK source</li>
      <li>Add: SKINWALKER source</li>
      <li>Add: PILOTS source</li>
      <li>Add: CANADAGOV source</li>
      <li>Add: UKTNA source</li>
      <li>Add: BRAZILGOV source</li>
      <li>(h/t PhenomAInon)</li>
    </ul>

    <div>1651532031</div>
    <ul>
      <li>Fix: Month wrong on MUFON records</li>
      <li>Fix: NUFORC attachments aren't parsed</li>
      <li>Fix: Normalize districts to full names</li>
      <li>Add: Word count column</li>
      <li>Add: Twitter share buttons</li>
      <li>Add: About section</li>
      <li>Add: Changelog section</li>
      <li>Add: Newsletter signup</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();
let meta = inject("meta") as HeadTags;

function setMeta() {
  let title = "UPDB | News";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();
</script>
