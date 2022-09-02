import provinces from "provinces";
import { sources } from "@/enums";

export const isMobile = !import.meta.env.SSR && navigator.userAgent.includes(" Mobile/");
export const isNarrow = !import.meta.env.SSR && document.body.offsetWidth <= 420;
export const baseUrl = import.meta.env.VITE_API_BASEURL;

export let infoSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm0-338c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>';

let provincesUpperCased = provinces.map(p => {
  let pp = { ...p };
  if (pp.name) pp.name = pp.name.toUpperCase();
  if (pp.english) pp.english = pp.english.toUpperCase();
  if (pp.region) pp.region = pp.region.toUpperCase();
  if (pp.country) pp.country = pp.country.toUpperCase();
  if (pp.alt) pp.alt = pp.alt.map(a => a.toUpperCase());
  return pp;
});

export function linkify(text: string) {
  return text.replace(/(https?:\/\/.*)(\s)?/gm, '<a href="$1" target="_blank">$1</a>$2');
}

export function lf2br(text: string) {
  return text.replace(/\n/gm, "<br />");
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

export function capitalize(str): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function paramSummary(param) {
  let filters = object2array(param);

  if (!filters.length) return "";

  let filterStrings = [];
  let locationFilters = {};
  let locationFields = ["city", "district", "country", "water", "other"];
  let allFields = ["source", "date", "description", ...locationFields];
  let dateValue = "";
  let descValue = "";

  for (const allField of allFields) {
    let filter = filters.find(f => f.field === allField);
    if (!filter) continue;
    let field = filter.field;
    let value = filter;
    let formattedValue = "";

    if (locationFields.includes(field)) {
      locationFilters[field] = value;
    }
    else if (field === "date") {
      if (value.length == 1) {
        dateValue = "from " + value;
      }
      else if (!value[0] && value[1]) {
        dateValue = "to " + value[1];
      }
      else if (!value[1] && value[0]) {
        dateValue = "from " + value[0];
      }
      else if (value.length == 2 && value[0] && value[1]) {
        dateValue = value[0] + "–" + value[1];
      }
    }
    else if (field === "source") {
      formattedValue = [value]
        .flat()
        .map(s => sources[s])
        .join(", ");
    }
    else if (field === "description" && value) {
      let kword = "keyword";
      if (value.includes(" or ")) {
        kword += "s";
        value = value.replace(" or ", "” or “");
      }
      descValue = `matching ${kword} “${value}”`;
    }

    filterStrings.push(formattedValue);
  }

  if (Object.keys(locationFilters).length) {
    let locations = [];
    for (const field of locationFields) {
      if (locationFilters[field]) locations.push(locationFilters[field]);
    }
    if (locations.length) filterStrings.push("matching location “" + locations.join(", ") + "”");
  }

  let value = "";

  for (let idx = 0; idx < allFields.length; idx++) {
    const filterString = filterStrings[idx];
    if (!filterString) continue;
    value += filterString + " ";
  }

  if (dateValue) value += dateValue + " ";
  if (descValue) value += descValue;

  return value;
}

export function getDistrictNames(district, country) {
  district = district.toUpperCase();

  let found = provincesUpperCased.find(
    p =>
      (p.name === district || p.alt?.includes(district)) &&
      p.country.toUpperCase() === country.toUpperCase()
  );

  if (found) {
    let founds = [found.short];
    if (found.english) founds.push(found.english);
    if (found.alt) founds = [...founds, ...found.alt];
    return founds;
  }

  return [];
}

export function isCoordInLocation(result, lg1, lt1, lg2, lt2) {
  return (result.latitude > lt1 && result.latitude < lt2 &&
    result.longitude > lg1 && result.longitude < lg2);
}
