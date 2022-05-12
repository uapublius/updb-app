import { encode } from "html-entities";

function toString() {
  let titleVal = this.title?.trim() || "UPDB";
  let title = `<title>${titleVal}</title>`;

  let clean = v => encode(v?.trim() || "");

  let meta = Object.entries(this.meta)
    .map(([name, meta]) => {
      let es = Object.entries(meta).map(([n, v]) => `${clean(n)}="${clean(v)}"`);
      let e = `  <meta name="${name}" ${es.join(" ")} />`;
      return e;
    })
    .join("\n");

  let linkTags = Object.entries(this.link)
    .map(([rel, link]) => {
      let es = Object.entries(link).map(([n, v]) => `${clean(n)}="${clean(v)}" `);
      let e = `  <link rel="${rel} ${es.join(" ")} />`;
      return e;
    })
    .join("\n");

  let headerTags = [title, meta, linkTags].join("\n");

  return headerTags;
}

export default {
  install(app, tags) {
    tags.toString = toString;
    app.provide("meta", tags);
  }
};
