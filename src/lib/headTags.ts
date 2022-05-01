import { baseUrl } from "./util";

const title = 'UPDB | The Unexplained Phenomena Database';

const link = {
  'icon': { type: 'image/png', href: '/favicon.png' },
};

const description = "The world's largest open database of 290,000+ UFO and UAP reports.";

const meta = {
  'description': { content: description },
  'type': { content: 'website' },
  'viewport': { content: 'width=device-width, initial-scale=1.0, maximum-scale=1' },
  'apple-mobile-web-app-capable': { content: 'yes' },
  'og:title': { content: title },
  'og:description': { content: description },
  'og:image': { content: baseUrl + '/updb.jpg' },
  'og:url': { content: baseUrl },
  'twitter:title': { content: title },
  'twitter:description': { content: description },
  'twitter:image': { content: baseUrl + '/updb.jpg' },
  'twitter:url': { content: baseUrl },
  'twitter:card': { content: 'summary_large_image' }
};

const headTags: HeadTags = {
  title,
  link,
  meta
};

export default headTags;