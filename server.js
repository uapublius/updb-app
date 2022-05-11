let fs = require("fs");
let path = require("path");
let resolve = p => path.resolve(__dirname, p);

(async () => {
  try {
    let url = "/reports";
    let template = fs.readFileSync(resolve("dist/client/index.html"), "utf-8");
    let render = require("./dist/server/entry-server.js").render;
    let [appHtml, meta] = await render(url, {});
    let html = template.replace(`<!--meta-tags-->`, meta).replace(`<!--app-html-->`, appHtml);

    console.log("Content-Type: text/html");
    console.log("");
    console.log(html);
  } catch (e) {
    console.log(e.message);
  }
})();
