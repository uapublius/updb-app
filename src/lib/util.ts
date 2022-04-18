export const isMobile = navigator.userAgent.includes(" Mobile/");

export function linkify(text: string) {
  return text.replace(/(https?:\/\/.*)?(\s)?/gm, '<a href="$1" target="_blank">$1</a>$2');
}

export function lf2br(text: string) {
  return text.replace(/\n/gm, '<br />');
}

let shouldPrefix = ["http://www.nicap.org", "http://www.mufoncms.com"];

export function urlForAttachment(link: string) {
  if (shouldPrefix.some(prefix => link.startsWith(prefix))) {
    return `https://web.archive.org/web/${link}`;
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
