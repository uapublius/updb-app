import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Reports from "./pages/Reports.vue";
import Documents from "./pages/Documents.vue";
import Report from "./pages/Report.vue";
import About from "./pages/About.vue";
import News from "./pages/News.vue";
import Download from "./pages/Download.vue";
import Sources from "./pages/Sources.vue";

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
    name: "Documents",
    path: "/documents",
    component: Documents,
    props: true
  },
  {
    name: "About",
    path: "/about",
    component: About,
    props: true
  },
  {
    name: "Sources",
    path: "/sources",
    component: Sources,
    props: true
  },
  {
    name: "News",
    path: "/news",
    component: News,
    props: true
  },
  {
    name: "Download",
    path: "/download",
    component: Download,
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
