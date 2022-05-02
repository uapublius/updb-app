let fs = require("fs");
let path = require("path");
let express = require("express");

let resolve = p => path.resolve(__dirname, p);

async function buildApp(root) {
  let app = express();
  let vite = await require("vite").createServer({
    root,
    logLevel: "info",
    server: {
      middlewareMode: "ssr"
    }
  });
  app.use(vite.middlewares);
  return { app, vite };
}

async function getTemplateRender(vite, url) {
  let template = fs.readFileSync(resolve("index.html"), "utf-8");
  template = await vite.transformIndexHtml(url, template);
  let render = (await vite.ssrLoadModule("./src/entry-server.ts")).render;
  return { template, render };
}

async function handleRequest(vite, req, res) {
  try {
    let url = req.originalUrl;
    let { template, render } = await getTemplateRender(vite, url);
    let [appHtml, meta] = await render(url, {});
    let html = template.replace(`<!--meta-tags-->`, meta).replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite && vite.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
}

async function createServer(root = process.cwd()) {
  let { app, vite } = await buildApp(root);

  app.use("*", async (req, res) => handleRequest(vite, req, res));

  return { app, vite };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  })
);
