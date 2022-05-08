function toString() {
  let title = `<title>${this.title.trim()}</title>`;

  let meta = Object.entries(this.meta)
    .map(([name, meta]) => {
      let e = `  <meta name="${name}" `;
      Object.entries(meta).forEach(([n, v]) => (e += `${n.trim()}="${v.trim()}" `));
      e += "/>";
      return e;
    })
    .join("\n");

  let linkTags = Object.entries(this.link)
    .map(([rel, link]) => {
      let e = `  <link rel="${rel}" `;
      Object.entries(link).forEach(([n, v]) => (e += `${n}="${v}" `));
      e += "/>";
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
