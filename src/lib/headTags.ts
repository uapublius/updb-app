const title = "UPDB | The Unexplained Phenomena Database";

const link = {
  icon: { type: "image/png", href: "/favicon.png" }
};

const description = "Find UAP/UFO reports near you, including tic-tacs, orbs, triangles & saucers.";

const meta = {
  viewport: { content: "width=device-width, initial-scale=1.0, maximum-scale=1" },
  "apple-mobile-web-app-capable": { content: "yes" },
  description: { content: description },
  type: { content: "website" },
  "og:title": { content: title },
  "og:description": { content: description },
  "og:image": { content: "https://updb.app" + "/updb_wide.jpg" },
  "og:url": { content: "https://updb.app" },
  "twitter:title": { content: title },
  "twitter:card": { content: "summary_large_image" },
  "twitter:description": { content: description },
  "twitter:image": { content: "https://updb.app" + "/updb_wide.jpg" },
  "twitter:url": { content: "https://updb.app" }
};

const headTags: HeadTags = {
  title,
  link,
  meta
};

export default headTags;
