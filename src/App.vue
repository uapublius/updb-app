<template>
  <el-aside
    width="166"
    class="h-100 hide-narrow"
    :class="{ 'sidebar-collapsed': collapseSidebar }">
    <a
      class="toggle-sidebar select-none"
      @click="toggleSidebar">
      <icon-arrow-from-left
        v-if="collapseSidebar"
        @click="collapseSidebar = true" />
      <icon-arrow-from-right
        v-else
        @click="collapseSidebar = false" />
    </a>

    <div class="flex justify-content-center align-items-center pn-2 mn-4 ms-3">
      <h1 class="gradient-text">
        <router-link
          v-if="collapseSidebar"
          to="/"
          title="Home">
          U
        </router-link>
        <router-link
          v-if="!collapseSidebar"
          to="/"
          title="Home"
          class="me-4">
          UPDB
        </router-link>
      </h1>
    </div>

    <el-menu
      router
      :collapse-transition="false"
      :collapse="collapseSidebar">
      <el-menu-item index="/reports">
        <el-icon>
          <Tickets />
        </el-icon>
        <template #title>Reports</template>
      </el-menu-item>
      <el-menu-item index="/map">
        <el-icon>
          <MapLocation />
        </el-icon>
        <template #title>Map</template>
      </el-menu-item>
      <el-menu-item index="/documents">
        <el-icon>
          <TakeawayBox />
        </el-icon>
        <template #title>Documents</template>
      </el-menu-item>
      <el-menu-item index="/download">
        <el-icon>
          <Download />
        </el-icon>
        <template #title>Database</template>
      </el-menu-item>
    </el-menu>
  </el-aside>

  <router-view v-slot="{ Component }">
    <Suspense>
      <div
        class="page"
        :class="className">
        <component :is="Component" />
      </div>
    </Suspense>
  </router-view>

  <div class="mobile-nav flex w-100 show-narrow">
    <el-menu
      class="flex justify-content-between w-100"
      mode="horizontal"
      router
      :collapse-transition="false">
      <el-menu-item index="/">
        <div class="flex align-items-center">
          <h1 class="gradient-text">
            <router-link
              to="/"
              title="Home"
              class="mx-0">
              U
            </router-link>
          </h1>
        </div>
        <template #title />
      </el-menu-item>
      <el-menu-item index="/reports">
        <el-icon>
          <Tickets />
        </el-icon>
        <template #title>Reports</template>
      </el-menu-item>
      <el-menu-item index="/map">
        <el-icon>
          <MapLocation />
        </el-icon>
        <template #title>Map</template>
      </el-menu-item>
      <el-menu-item index="/documents">
        <el-icon>
          <TakeawayBox />
        </el-icon>
        <template #title>Documents</template>
      </el-menu-item>
      <el-menu-item index="/download">
        <el-icon>
          <Download />
        </el-icon>
        <template #title>Database</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import "./style/style.scss";
import {
  MapLocation, Download, TakeawayBox, Tickets, User
} from '@element-plus/icons-vue';
import {
  ElMenu, ElIcon, ElMenuItem, ElAside
} from 'element-plus';
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mapInstance } from "@/composables/useMap";
let route = useRoute();
let router = useRouter();
let className = $ref({});
let collapseSidebar = $ref(false);

function addPageClass() {
  if (route.name) {
    className = {
      ["page-" + route.name.toString().toLowerCase().replace(/page$/, "")]: true
    };
  }
  else {
    console.warn("No route name to apply css class", route.name);
  }
}

function toggleSidebar() {
  collapseSidebar = !collapseSidebar;
  setTimeout(() => mapInstance?.resize(), 300);
  setTimeout(() => mapInstance?.resize(), 1000);
  if (collapseSidebar) {
    localStorage.setItem('collapseSidebar', collapseSidebar.toString());
  }
  else {
    localStorage.removeItem('collapseSidebar');
  }
}

router.afterEach(() => addPageClass());

onMounted(async () => {
  addPageClass();

  if (localStorage.getItem('collapseSidebar')) {
    collapseSidebar = true;
  }
});
</script>

<style scoped>
.el-aside {
  position: fixed;
  z-index: 2;
}

.el-aside:hover .toggle-sidebar {
  display: block;
}

.toggle-sidebar {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
  font-size: 18px;
  display: none;
  height: 56px;
}

.toggle-sidebar svg {
  fill: #ccc;
}

.toggle-sidebar:hover svg {
  fill: #aaa;
}

.mobile-nav {
  background: #fff;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
}

.mobile-nav .el-menu-item:first-child {
  padding: 0 8px !important;
}

.mobile-nav .el-menu-item {
  padding: 0 6px 0 1px !important;
  font-size: 14px;
}

.mobile-nav .el-menu--horizontal {
  border-bottom: 0;
  padding: 0;
  border-top: 1px solid #eeefee;
  width: 100%;
}

.mobile-nav .el-menu--horizontal .el-menu-item {
  min-width: 0;
  border-bottom: none;
}

.mobile-nav .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}

.mobile-nav .el-menu-item .el-icon {
  margin-right: 1px;
  font-size: 13px;
}
</style>