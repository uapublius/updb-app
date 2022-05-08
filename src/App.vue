<template>
  <main class="flex flex-column h-100">
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
