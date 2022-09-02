import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from "vue-router";
import DocumentsList from "./components/sections/documents-list.vue";
import ReportsList from "./components/sections/reports-list.vue";
import ReportsTable from "./components/sections/reports-table.vue";
import DatabasePage from "./pages/DatabasePage.vue";
import DocumentsPage from "./pages/DocumentsPage.vue";
import HomePage from "./pages/HomePage.vue";
import MapPage from "./pages/MapPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import ReportPage from "./pages/ReportPage.vue";
import ReportsByCountry from "./pages/ReportsByCountry.vue";
import ReportsPage from "./pages/ReportsPage.vue";
import SubmitPage from "./pages/SubmitPage.vue";

let routes = [
  {
    name: "HomePage",
    path: "/",
    component: HomePage,
    props: true
  },
  {
    path: "/about",
    redirect: '/'
  },
  {
    path: "/news",
    redirect: '/'
  },
  {
    name: "Submit",
    path: "/submit",
    component: SubmitPage,
    props: true
  },
  {
    name: "Reports",
    path: "/reports",
    component: ReportsPage,
    redirect: '/reports/list',
    props: true,
    children: [
      {
        name: "ReportsTable",
        path: "table",
        component: ReportsTable,
        redirect: '/reports/search',
        props: true
      },
      {
        name: "ReportsList",
        path: "list",
        component: ReportsList,
        redirect: '/reports/search',
        props: true
      },
      {
        name: "ReportsSearch",
        path: "search",
        component: ReportsList,
        props: true
      },
      {
        name: "ReportsForCountryDistrict",
        path: "country/:country/:district",
        component: ReportsList,
        props: true
      },
      {
        name: "ReportsForCountry",
        path: "country/:country",
        component: ReportsList,
        props: true
      }
    ]
  },
  {
    name: "ReportsByCountry",
    path: "/reports/country",
    component: ReportsByCountry
  },
  {
    name: "ReportPage",
    path: "/report/:source-:sourceId",
    component: ReportPage,
    props: true
  },
  {
    name: "Documents",
    path: "/documents",
    component: DocumentsPage,
    redirect: '/documents/list',
    props: true,
    children: [
      {
        name: "DocumentsList",
        path: "list",
        component: DocumentsList,
        props: true
      }
    ]
  },
  {
    name: "Map",
    path: "/map",
    component: MapPage
  },
  {
    name: "Download",
    path: "/download",
    component: DatabasePage,
    props: true
  },
  {
    path: '/:pathMatch(.*)',
    component: NotFoundPage
  }
];

export function createRouter(args = {}) {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }

      if (to.hash) {
        return {
          el: to.hash,
          behavior: "smooth"
        };
      }

      return { top: 0, left: 0 };
    },
    ...args
  });
}
