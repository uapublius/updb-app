import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Reports from "./pages/Reports.vue";
import Report from "./pages/Report.vue";
import About from "./pages/About.vue";
import Changelog from "./pages/Changelog.vue";

let routes = [
  {
    name: "HomePage",
    path: "/",
    component: Home,
    props: true
  },
  {
    name: "Reports",
    path: "/reports",
    component: Reports,
    props: true
  },
  {
    name: "About",
    path: "/about",
    component: About,
    props: true
  },
  {
    name: "Changelog",
    path: "/changelog",
    component: Changelog,
    props: true
  },
  {
    name: "ReportPage",
    path: "/report/:source-:sourceId",
    component: Report,
    props: true
  }
];

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  });
}
