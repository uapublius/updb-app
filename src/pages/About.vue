<template>
  <div class="p-2">
    <h2 class="ms-3">About</h2>

    <strong>UPDB is a free database of unexplained phenomena reports & documents.</strong>

    <h3 class="mn-3 ms-2">Goals</h3>

    <ul>
      <li>Preserve and honor the decades of research and data collection on this topic.</li>
      <li>Create open-source datasets and tools for unexplained phenomena research.</li>
      <li>Develop tools and techniques for individuals with ongoing repeated experiences.</li>
      <li>
        Document any potential crimes against the universal human right of individual sovereignty,
        for current and future generations.
      </li>
    </ul>

    <h3 class="mn-3 ms-2">Dedications</h3>

    <ul>
      <li>Jacques Vallée</li>
      <li>George Knapp</li>
      <li>Garry Nolan</li>
      <li>Ross Coulthart</li>
    </ul>

    <h3 class="mn-3 ms-2">Contact</h3>

    <client-only>
      Publius
      <a href="mailto:uapublius@protonmail.com">&lt;uapublius@protonmail.com&gt;</a>
    </client-only>

    <figure class="mn-4 ms-2">
      <div class="inline-block text-center">
        <a href="https://twitter.com/uapublius" target="_blank">
          <img src="../assets/publius.jpg" style="height: 359px" />
        </a>
        <figcaption class="mn-1">&nbsp;&nbsp;Publius Valerius Poplicola (died 503 BC)</figcaption>
      </div>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();
let meta = inject("meta") as HeadTags;

function setMeta() {
  let title = "UPDB | About";
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
