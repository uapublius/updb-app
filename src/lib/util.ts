export function linkify(text: string) {
  return text.replace(/(https?:\/\/.*)(\s)?/gm, '<a href="$1" target="_blank">$1</a>$2');
}

export function lf2br(text: string) {
  return text.replace(/\n/gm, '<br />');
}

export function saveToFile(content: string, filename: string) {
  let bl = new Blob([content], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(bl);
  a.download = filename;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function object2array(o) {
  let arr = [];

  for (let idx = 0; idx < Object.keys(o).length; idx++) {
    arr.push(o[idx]);
  }

  return arr;
}

export const isMobile = !import.meta.env.SSR && navigator.userAgent.includes(" Mobile/");
export const isNarrow = !import.meta.env.SSR && document.body.offsetWidth <= 420;
export const baseUrl = import.meta.env.VITE_DOMAIN || 'http://localhost:3000';