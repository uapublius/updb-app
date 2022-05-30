<template>
  <main class="flex flex-column h-100 w-100">
    <app-header />

    <router-view v-slot="{ Component }">
      <Suspense>
        <div :class="className">
          <component :is="Component" />
        </div>
      </Suspense>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

let route = useRoute();
let router = useRouter();
let className = ref({});

function addPageClass() {
  if (route.name) {
    className.value = {
      ["page-" + route.name.toString().toLowerCase().replace(/page$/, "")]: true
    };
  } else {
    console.warn("No route name to apply css class", route.name);
  }
}

router.afterEach(() => addPageClass());
onMounted(() => addPageClass());
</script>
