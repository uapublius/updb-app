<template>
  <div
    class="w-100 h-100 ps-5 search-box flex flex-column align-items-center justify-content-center"
    ref="searchBox"
  >
    <div class="flex ms-4"><h1 class="gradient-text">UPDB</h1></div>

    <div class="ms-4">
      <div class="fields-keyword flex justify-content-center">
        <input
          v-model="store.keyword"
          autofocus
          name="keyword"
          class="mx-2"
          type="search"
          placeholder="Keywords"
          @focus="saveFocus"
          @keyup.enter="search"
        />
      </div>
    </div>

    <div class="ms-4">
      <div class="fields-location">
        <input
          v-model="store.city"
          name="city"
          class="btn-gradient-1 mx-1 my-1"
          type="search"
          placeholder="City"
          @focus="saveFocus"
          @keyup.enter="search"
        />

        <input
          v-model="store.district"
          name="district"
          class="mx-1 my-1"
          type="search"
          placeholder="District"
          @focus="saveFocus"
          @keyup.enter="search"
        />

        <input
          v-model="store.country"
          name="country"
          class="mx-1 my-1"
          type="search"
          placeholder="Country"
          maxlength="2"
          @focus="saveFocus"
          @keyup.enter="search"
        />

        <input
          v-model="store.water"
          name="water"
          class="mx-1 my-1"
          type="search"
          placeholder="Water"
          @focus="saveFocus"
          @keyup.enter="search"
        />

        <input
          v-model="store.other"
          name="other"
          class="mx-1 my-1"
          type="search"
          placeholder="Other"
          @focus="saveFocus"
          @keyup.enter="search"
        />
      </div>
    </div>

    <div class="ms-4">
      <div class="fields-date flex">
        <input
          v-model="store.from"
          type="search"
          name="from"
          class="mx-1"
          placeholder="From"
          @focus="saveFocus"
          @keyup.enter="search"
        />
        <input
          v-model="store.to"
          type="search"
          name="to"
          class="mx-1"
          placeholder="To"
          @focus="saveFocus"
          @keyup.enter="search"
        />
      </div>
    </div>

    <input
      type="submit"
      class="mx-2 my-3"
      @click="search"
      @submit.prevent="search"
      value="Search"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import qs from "qs";
import { useSearchStore } from "@/store";
import { useSaveFocus } from "../composables/useSaveFocus";

let { saveFocus, searchBox } = useSaveFocus();
let store = useSearchStore();
let route = useRoute();
let router = useRouter();
let meta = inject("meta") as HeadTags;

let filters = computed(() => {
  let filters = [
    { field: "description", type: "fts", value: store.keyword },
    {
      field: "city",
      type: "ulike",
      value: store.city
    },
    {
      field: "district",
      type: "ulike",
      value: store.district
    },
    {
      field: "country",
      type: "u=",
      value: store.country
    },
    {
      field: "water",
      type: "ulike",
      value: store.water
    },
    {
      field: "other",
      type: "ulike",
      value: store.other
    },
    {
      field: "date",
      type: "ov",
      value: [store.from, store.to]
    }
  ];

  return qs.stringify(filters);
});

function search() {
  router.push({
    path: "/search/reports",
    query: { filters: filters.value }
  });
}

function setMeta() {
  let title = "UPDB | The Unexplained Phenomena Database";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();
</script>

<style scoped>
h1 {
  font-size: 8em;
}
</style>
