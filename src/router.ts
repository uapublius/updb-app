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
      },
      {
        name: "ReportsForSource",
        path: "source/:sourcename",
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
    path: "/docs",
    redirect: '/documents/list'
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
  function scrollWindow(savedPosition) {
    if (window.scrollY === 0) {
      window.scrollTo(savedPosition.left, savedPosition.top);
    }
  }

  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        setTimeout(() => scrollWindow(savedPosition), 150);
        setTimeout(() => scrollWindow(savedPosition), 300);
        setTimeout(() => scrollWindow(savedPosition), 900);
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
