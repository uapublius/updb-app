import axios from "axios";

export const isMobile = navigator.userAgent.includes(" Mobile/");

export function linkify(text: string) {
  return text.replace(/(https?:\/\/.*)?(\s)?/gm, '<a href="$1" target="_blank">$1</a>$2');
}

export function lf2br(text: string) {
  return text.replace(/\n/gm, '<br />');
}

let shouldPrefix = ["http://www.nicap.org", "http://www.mufoncms.com"];

let cachedArchiveOrgUrls = {};
let storedCachedArchiveOrgUrls = localStorage.getItem('cachedArchiveOrgUrls');

if (storedCachedArchiveOrgUrls) {
  try {
    cachedArchiveOrgUrls = JSON.parse(storedCachedArchiveOrgUrls);
  } catch (error) { }
}

export async function loadUrlsForAttachments(attachments: string[]) {
  return Promise.all(attachments.map(attachment => urlForAttachment(attachment)));
}

export async function urlForAttachment(link: string): Promise<string> {
  if (shouldPrefix.some(prefix => link.startsWith(prefix))) {
    if (cachedArchiveOrgUrls[link]) return cachedArchiveOrgUrls[link];
    let defaultUrl = `https://web.archive.org/web/${link}`;

    try {
      let apiUrl = `https://archive.org/wayback/available?url=${link}`;
      let { data } = await axios.get(apiUrl);
      let cachedUrl = data.archived_snapshots.closest?.url;

      if (cachedUrl) {
        let [id] = cachedUrl.match(/(\d{14})/);
        let url = `https://web.archive.org/web/${id}if_/${link}`;

        cachedArchiveOrgUrls[link] = url;
        localStorage.setItem('cachedArchiveOrgUrls', JSON.stringify(cachedArchiveOrgUrls));
        return url;
      }
      else {
        return defaultUrl;
      }
    } catch (error) {
      return defaultUrl;
    }
  }

  return link;
}

export function saveFile(content: string, filename: string) {
  let bl = new Blob([content], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(bl);
  a.download = filename;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
