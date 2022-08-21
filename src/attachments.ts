import axios from "axios";

let shouldPrefix = ["http://www.nicap.org", "http://www.mufoncms.com"];
let mirroredUrls = {};

export async function loadUrlsForAttachments(attachments: string[] = []) {
  return Promise.all(attachments.map(attachment => urlForAttachment(attachment)));
}

export async function urlForAttachment(link: string): Promise<string> {
  if (shouldPrefix.some(prefix => link.startsWith(prefix))) {
    let date = +new Date();
    let oneMonth = 2.628e9;
    let cachedUrl = mirroredUrls[link];

    if (cachedUrl?.link && date - cachedUrl?.date < oneMonth) {
      return cachedUrl.link;
    }

    let defaultUrl = `https://web.archive.org/web/${link}`;

    if (cachedUrl?.link === null) {
      return defaultUrl;
    }

    try {
      let apiUrl = `https://updb.app/api/wayback/wayback/available?url=${link}`;
      let { data } = await axios.get(apiUrl);
      let cachedUrl = data.archived_snapshots.closest?.url;
      let url = defaultUrl;

      if (cachedUrl) {
        let [id] = cachedUrl.match(/(\d{14})/);
        url = `https://web.archive.org/web/${id}if_/${link}`;
        mirroredUrls[link] = { date, link: url };
      }
      else {
        mirroredUrls[link] = { date, link: null };
      }

      return url;
    }
    catch (error) {
      return defaultUrl;
    }
  }

  return link;
}
