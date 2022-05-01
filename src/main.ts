import { createSSRApp } from 'vue';
import App from './App.vue';
import { registerIcons } from './registerIcons';
import { createRouter } from './router';
import meta from './plugins/meta';
import head from './lib/headTags';
import ClientOnly from './components/client-only';

export function createApp() {
  const app = createSSRApp(App);
  const router = createRouter();

  registerIcons(app);
  app.use(router);
  app.use(meta, head);
  app.component("ClientOnly", ClientOnly);

  return { app, router, head };
}
