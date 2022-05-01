import axios from "axios";

let shouldPrefix = ["http://www.nicap.org", "http://www.mufoncms.com"];
let cachedArchiveOrgUrls = {};

export function setupStorage() {
  let storedCachedArchiveOrgUrls = localStorage.getItem('cachedArchiveOrgUrls');

  if (storedCachedArchiveOrgUrls) {
    try {
      cachedArchiveOrgUrls = JSON.parse(storedCachedArchiveOrgUrls);
    } catch (error) { }
  }
}

export async function loadUrlsForAttachments(attachments: string[] = []) {
  return Promise.all(attachments.map(attachment => urlForAttachment(attachment)));
}

export async function urlForAttachment(link: string): Promise<string> {
  if (shouldPrefix.some(prefix => link.startsWith(prefix))) {
    let date = +new Date();
    let oneMonth = 2.628e+9;
    let cachedLink = cachedArchiveOrgUrls[link];

    if (cachedLink?.link && (date - cachedLink?.date < oneMonth)) {
      console.log("Returning cached link", cachedLink.link);
      return cachedLink.link;
    }

    let defaultUrl = `https://web.archive.org/web/${link}`;

    if (cachedLink?.link === null) {
      return defaultUrl;
    }

    try {
      let apiUrl = `https://archive.org/wayback/available?url=${link}`;
      let { data } = await axios.get(apiUrl);
      let cachedUrl = data.archived_snapshots.closest?.url;
      let url = defaultUrl;

      if (cachedUrl) {
        let [id] = cachedUrl.match(/(\d{14})/);
        url = `https://web.archive.org/web/${id}if_/${link}`;
        cachedArchiveOrgUrls[link] = { date, link: url };
      }
      else {
        cachedArchiveOrgUrls[link] = { date, link: null };
      }

      localStorage.setItem('cachedArchiveOrgUrls', JSON.stringify(cachedArchiveOrgUrls));

      return url;
    } catch (error) {
      return defaultUrl;
    }
  }

  return link;
}
