<template>
  <div class="p-2 max-width-narrow">
    <h2 class="ms-3">News</h2>
    <client-only>
      <newsletter />
    </client-only>

    <h3 class="mn-3 ms-2">Changelog</h3>

    <div>1652372012</div>
    <ul class="ms-2">
      <li>Add: Info tooltips for source and date columns</li>
      <li>Add: Max width for report text to improve readability</li>
      <li>Add: Page and document result count to document search</li>
      <li>Add: Some more details on about page</li>
      <li>Add: Icons for table actions</li>
      <li>Fix: Update search tips</li>
      <li>Fix: Document search input too wide on narrow screens</li>
      <li>Fix: Meta tags not correct for searches with quotes</li>
    </ul>

    <div>1652306234</div>
    <ul class="ms-2">
      <li>Add: More project, source, and technical information in the About section</li>
      <li>Add: Search tips</li>
    </ul>

    <div>1652246608</div>
    <ul class="ms-2">
      <li>
        Add: Document search.
        <ul>
          <li>Search over 70,000 (500,000+ pages of) UAP/UFO related documents.</li>
          <li>
            Built using custom machine-learning based OCR software run over 1.5 TB of PDF and JPG
            files.
          </li>
        </ul>
      </li>
      <li>Add: Sources section with provenance information for each source and aggregator.</li>
      <li>Add: Download tab with links to the raw postgreSQL databases.</li>
      <li>Change: Renamed UKGOV to UKTNA</li>
      <li>
        Fix: Location parsing fixes for BAASS, NIDS, BLUEBOOK, SKINWALKER, PILOTS, CANADAGOV, UKTNA
        and BRAZILGOV sources.
      </li>
    </ul>

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
