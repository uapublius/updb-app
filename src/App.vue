<template>
  <main class="flex flex-column h-100 flex-fill">
    <app-header />
    <router-view v-slot="{ Component }">
      <Suspense>
        <div>
          <component :is="Component" />
        </div>
      </Suspense>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import "./style/style.scss";
</script>