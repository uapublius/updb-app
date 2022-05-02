import { createApp } from './main';
import { renderToString } from 'vue/server-renderer';

export async function render(url) {
  let { app, router, head } = createApp();

  router.push(url);
  await router.isReady();

  let ctx = {};
  let html = await renderToString(app, ctx);

  return [html, head];
}
