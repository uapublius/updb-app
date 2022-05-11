<template>
  <div class="p-2">
    <h2 class="ms-3">Sources</h2>

    <strong>
      Thank you to the following organizations for helping to build to an open and public record of
      unknown phenomena.
    </strong>

    <ul class="my-3">
      <li>MUFON</li>
      <li>NUFORC</li>
      <li>NICAP</li>
      <li>BAASS</li>
      <li>NIDS</li>
    </ul>

    <h2 class="ms-3">Aggregators</h2>
    <ul>
      <li>UFODNA</li>
      <li>PhenomAInon</li>
    </ul>

    <figure class="mn-4 ms-2">
      <img src="../assets/pliny.jpg" style="height: 400px" />
      <blockquote class="mn-1">
        &ldquo;Nothing which we can imagine about Nature is incredible.&rdquo;
      </blockquote>
      <figcaption class="mn-1">&nbsp;&nbsp;—Pliny the Elder (23–79 AD)</figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();
let meta = inject("meta") as HeadTags;

function setMeta() {
  let title = "UPDB | Sources";
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
