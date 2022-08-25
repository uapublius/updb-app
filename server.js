let express = require('express');
let path = require('path');
let fs = require('fs');

let resolve = p => path.resolve(__dirname, p);

async function buildApp() {
  let app = express();
  let vite;

  app.use(require('compression')());
  app.use(
    require('serve-static')(resolve('dist/client'), {
      index: false
    })
  );

  return { app, vite };
}

async function getTemplateRender() {
  let indexProd = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
  let template = indexProd;
  let render = require('./dist/server/entry-server.js').render;

  return { template, render };
}

async function handleRequest(vite, req, res) {
  try {
    let url = req.originalUrl;
    let { template, render } = await getTemplateRender(vite, url);
    let [appHtml, meta] = await render(url, {});
    let html = template
      .replace(`<!--meta-tags-->`, meta)
      .replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  }
  catch (e) {
    vite && vite.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end('Internal Server Error');
  }
}

async function createServer(root = process.cwd()) {
  let { app, vite } = await buildApp(root);

  app.use('*', async (req, res) => handleRequest(vite, req, res));

  return { app, vite };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('http://localhost:3000');
  })
);
