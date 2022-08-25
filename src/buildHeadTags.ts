import { HeadTags } from "@/types/types";

let title = "UPDB | The Unexplained Phenomena Database";
let link = { icon: { type: "image/png", href: "/favicon.png" } };
let description = "Find UAP/UFO reports near you, including tic-tacs, orbs, triangles & saucers.";
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
