<template>
  <div class="p-2">
    <h2 class="ms-3">Download</h2>

    <h4 class="ms-2">Reports</h4>

    <a target="_blank" href="https://web.archive.org/web/https://updb.app/phenomenon.sql.gz">
      <icon name="download" />
      <div class="mw-1">phenomenon.sql.gz</div>
    </a>

    <h4 class="my-2">Document Index</h4>

    <a target="_blank" href="https://web.archive.org/web/https://updb.app/phenomenon_docs.sql.gz">
      <icon name="download" />
      <div class="mw-1">phenomenon_docs.sql.gz</div>
    </a>

    <div class="my-3">
      <h4 class="ms-2">Instructions</h4>
      Install postgreSQL then use the following commands to restore the database:
      <pre class="mn-1 bg-highlight p-1">
createdb phenomenon
gunzip -c phenomenon.sql.gz | psql -v ON_ERROR_STOP=1 phenomenon</pre>
    </div>

    <figure class="mn-4 ms-2">
      <img src="../assets/pliny.jpg" style="height: 400px" />
      <blockquote class="mn-1">
        &ldquo;Nothing which we can imagine about Nature is incredible.&rdquo;
      </blockquote>
      <figcaption>&nbsp;&nbsp;—Pliny the Elder (23–79 AD)</figcaption>
    </figure>

  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();
let meta = inject("meta") as HeadTags;

function setMeta() {
  let title = "UPDB | Download";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();
</script>

<style scoped>
figure {
  color: hsl(0, 1%, 40%);
  line-height: 1;
}
</style>
