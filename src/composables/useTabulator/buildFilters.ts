export function buildFilters(allFilters: any) {
  let filters = {};

  let definedFilters = allFilters.filter(p => {
    return Array.isArray(p) ? p.length : p !== undefined;
  });

  if (!definedFilters.length) return filters;

  filters = definedFilters.reduce((acc: any, curr: any) => {
    if (!curr) return acc;
    if (curr.type === "like") {
      acc[curr.field] = "like.*" + curr + "*";
    }
 else if (curr.type === "ulike") {
      acc[curr.field] = "like.*" + curr.value.toUpperCase() + "*";
    }
 else if (curr.type === "=") {
      if (Array.isArray(curr)) {
        acc[curr.field] = acc[curr.field] || [];
        acc[curr.field].push("in.(" + curr.value.join(",") + ")");
      }
 else {
        acc[curr.field] = "eq." + curr;
      }
    }
 else if (curr.type === "u=") {
      if (Array.isArray(curr)) {
        acc[curr.field] = acc[curr.field] || [];
        acc[curr.field].push("in.(" + curr.value.map(v => v.toUpperCase()).join(",") + ")");
      }
 else {
        acc[curr.field] = "eq." + curr.value.toUpperCase();
      }
    }
 else if (curr.type === "in") {
      if (Array.isArray(curr)) {
        acc[curr.field] = acc[curr.field] || [];
        acc[curr.field].push("in.(" + curr.value.join(",") + ")");
      }
    }
 else if (curr.type === "fts") {
      let field = curr.field;
      if ((field = "description")) field = "ts";
      acc[field] = "wfts." + curr.value;
    }
 else if (curr.type === "ov") {
      if (curr.value.length < 2) return;
      let from = curr.value[0];
      let to = curr.value[1];
      let ff = [];
      if (from) ff.push(`${curr.field}.gte.${from}`);
      if (to) ff.push(`${curr.field}.lte.${to}`);
      if (ff.length) acc["and"] = `(${ff.join(",")})`;
    }
 else {
      console.log("Unknown filter type " + curr.type);
    }

    return acc;
  }, filters);

  return filters;
}
