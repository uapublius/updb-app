import { ElInfiniteScroll, ID_INJECTION_KEY } from "element-plus";
import { createSSRApp } from "vue";
import App from "./App.vue";
import head from "./buildHeadTags";
import ClientOnly from "./components/widgets/client-only";
import { pinia } from "./pinia";
import meta from "./plugins/meta";
import { createRouter } from "./router";

function registerIcons(app) {
  let components = import.meta.globEager('./assets/icons/*.svg');

  Object.entries(components).forEach(([path, definition]) => {
    let componentName = path.split('/').pop().replace(/\.\w+$/, '');
    app.component("icon-" + componentName, definition.default);
  });
}

export function createApp() {
  let app = createSSRApp(App);
  let router = createRouter();

  registerIcons(app);

  app.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0
  });

  app.use(ElInfiniteScroll);

  app.use(router);
  app.use(pinia);

  app.use(meta, head);
  app.component("ClientOnly", ClientOnly);

  return { app, router, head };
}
