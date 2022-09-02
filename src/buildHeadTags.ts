import { HeadTags } from "@/types/types";

let title = "UPDB | Unexplained Phenomena Database";
let link = { icon: { type: "image/png", href: "/favicon.png" } };
let description = "Search engine and map for UFO reports & documents – including UAP, tic-tacs, and other unexplained phenomena.";
let url = "https://updb.app";
let image = "https://updb.app/updb_wide.jpg";

let meta = {
  viewport: { content: "width=device-width, initial-scale=1.0, maximum-scale=1" },
  "apple-mobile-web-app-capable": { content: "yes" },
  description: { content: description },
  type: { content: "website" },
  "og:title": { content: title },
  "og:description": { content: description },
  "og:image": { content: image },
  "og:url": { content: url },
  "twitter:title": { content: title },
  "twitter:card": { content: "summary_large_image" },
  "twitter:description": { content: description },
  "twitter:image": { content: image },
  "twitter:url": { content: url }
};

let headTags: HeadTags = {
  title,
  description,
  link,
  meta,
  url,
  image
};

export default headTags;
