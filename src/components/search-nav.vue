<template>
  <div class="tabs my-3">
    <router-link class="me-3" :to="{ path: '/search/reports', query: $route.query }">
      Reports
    </router-link>
    <router-link :to="{ path: '/search/docs', query: $route.query }">Documents</router-link>
  </div>
</template>
