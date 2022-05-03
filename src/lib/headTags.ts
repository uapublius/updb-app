const title = "UPDB | The Unexplained Phenomena Database";

const link = {
  icon: { type: "image/png", href: "/favicon.png" }
};

const description = "The world's largest open database of 290,000+ UFO and UAP reports.";

const meta = {
  viewport: { content: "width=device-width, initial-scale=1.0, maximum-scale=1" },
  "apple-mobile-web-app-capable": { content: "yes" },
  description: { content: description },
  type: { content: "website" },
  "og:title": { content: title },
  "og:description": { content: description },
  "og:image": { content: "https://updb.app" + "/updb.jpg" },
  "og:url": { content: "https://updb.app" },
  "twitter:title": { content: title },
  "twitter:description": { content: description },
  "twitter:image": { content: "https://updb.app" + "/updb.jpg" },
  "twitter:url": { content: "https://updb.app" },
  "twitter:card": { content: "summary_large_image" }
};

const headTags: HeadTags = {
  title,
  link,
  meta
};

export default headTags;
