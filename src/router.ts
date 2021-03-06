import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Reports from "./pages/Reports.vue";
import Documents from "./pages/Documents.vue";
import Report from "./pages/Report.vue";
import About from "./pages/About.vue";
import Maps from "./pages/Maps.vue";
import News from "./pages/News.vue";
import Download from "./pages/Download.vue";
import SearchDocs from "./pages/SearchDocs.vue";
import SearchReports from "./pages/SearchReports.vue";

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
    name: "Maps",
    path: "/maps",
    component: Maps,
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
    name: "SearchDocs",
    path: "/search/docs",
    component: SearchDocs,
    props: true
  },
  {
    name: "SearchReports",
    path: "/search/reports",
    component: SearchReports,
    props: true
  },
  {
    name: "ReportPage",
    path: "/report/:source-:sourceId",
    component: Report,
    props: true
  }
];

export function createRouter(args) {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    ...args
  });
}
