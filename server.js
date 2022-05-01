// @ts-check
let fs = require('fs');
let path = require('path');
let express = require('express');

let resolve = (p) => path.resolve(__dirname, p);

async function buildApp(root, isProd) {
  let app = express();
  let vite;

  if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: 'ssr'
      }
    });

    app.use(vite.middlewares);
  } else {
    app.use(require('compression')());
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false
      })
    );
  }

  return { app, vite };
}

async function getTemplateRender(vite, url, isProd) {
  let template;
  let render;

  if (!isProd) {
    template = fs.readFileSync(resolve('index.html'), 'utf-8');
    template = await vite.transformIndexHtml(url, template);
    render = (await vite.ssrLoadModule('./entry-server.ts')).render;
  } else {
    let indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : '';
    template = indexProd;
    // @ts-ignore
    render = require('./dist/server/entry-server.js').render;
  }

  return { template, render };
}

async function handleRequest(vite, req, res, isProd) {
  try {
    // @ts-ignore
    let manifest = isProd ? require('./dist/client/ssr-manifest.json') : {};
    let url = req.originalUrl;
    let { template, render } = await getTemplateRender(vite, url, isProd);
    let [appHtml, meta] = await render(url, manifest);
    let html = template
      .replace(`<!--meta-tags-->`, meta)
      .replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    vite && vite.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
}

async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
  let { app, vite } = await buildApp(root, isProd);

  app.use('*', async (req, res) => handleRequest(vite, req, res, isProd));

  return { app, vite };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('http://localhost:3000');
  })
);
