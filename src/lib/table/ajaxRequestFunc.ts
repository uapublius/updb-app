import axios from 'axios';

export function buildParams(filter: Record<string, any>, sort: Record<string, any>[], page?: number, size?: number) {
  let order = sort?.map(p => p.field + "." + p.dir).join(',') || undefined;
  let filters = buildFilters(filter);

  let cols = [
    "id",
    "source",
    "source_id",
    "date",
    "date_detail",
    "description",
    "city",
    "district",
    "country",
    "continent",
    "water",
    "other"
  ];

  let params: Record<string, unknown> = {
    select: cols.join(','),
    order,
    ...filters
  };

  if (page) params.offset = (page - 1) * size;
  if (size) params.limit = size;

  return params;
}

export let ajaxRequestFunc = (table) => (handleTotalRows: (total: number) => void) => async (url, config, params) => {
  let paginationData = await buildPaginationData(
    updateRowsWithAttachments(table.tabulator),
    updateRowsWithReferences(table.tabulator),
    url,
    config,
    params
  );

  handleTotalRows(paginationData.rowCount);

  return paginationData;
};

let updateRowsWithAttachments = (table) => ({ data }) => {
  let attachmentsByReportId = data.reduce((acc, curr) => {
    acc[curr.report] = acc[curr.report] || [];
    acc[curr.report].push(curr.url);
    return acc;
  }, {});

  for (let [id, attachments] of Object.entries(attachmentsByReportId)) {
    table.updateData([{ id, attachments }]);
  }
};

let updateRowsWithReferences = (table) => ({ data }) => {
  let referencesByReportId = data.reduce((acc, curr) => {
    acc[curr.report] = acc[curr.report] || [];
    acc[curr.report].push(curr.text);
    return acc;
  }, {});

  for (let [id, references] of Object.entries(referencesByReportId)) {
    table.updateData([{ id, references }]);
  }
};

async function buildPaginationData(updateRowsWithAttachments, updateRowsWithReferences, url, config, params) {
  let urlParams = new URLSearchParams(window.location.search);
  let count = urlParams.get('count') || 'estimated';

  let res = await axios.get(url, {
    headers: { "Prefer": `count=${count}` },
    params: buildParams(params.filter, params.sort, params.page, params.size)
  });
  let rowCount = parseInt(res.headers["content-range"]?.split('/')?.[1]) || 1;
  let lastPage = Math.ceil(rowCount / parseInt(params.size));

  axios.get('/api/attachment', {
    params: {
      report: 'in.(' + res.data.map(d => d.id) + ')'
    }
  }).then(updateRowsWithAttachments);

  axios.get('/api/report_reference_view', {
    params: {
      report: 'in.(' + res.data.map(d => d.id) + ')'
    }
  }).then(updateRowsWithReferences);

  return {
    last_page: lastPage,
    rowCount,
    data: res.data
  };
}

function buildFilters(allFilters: any) {
  let filters = {};

  let definedFilters = allFilters.filter(p => {
    return Array.isArray(p.value) ? p.value.length : p.value !== undefined;
  });

  if (definedFilters.length) {
    filters = definedFilters.reduce((acc, curr) => {

      if (curr.type === 'like') {
        acc[curr.field] = "like.*" + curr.value + "*";
      }
      if (curr.type === 'ulike') {
        acc[curr.field] = "like.*" + curr.value.toUpperCase() + "*";
      }
      else if (curr.type === '=') {
        if (Array.isArray(curr.value)) {
          acc[curr.field] = acc[curr.field] || [];
          acc[curr.field].push("in.(" + curr.value.join(',') + ")");
        }
        else {
          acc[curr.field] = "eq." + curr.value;
        }
      }
      else if (curr.type === 'u=') {
        if (Array.isArray(curr.value)) {
          acc[curr.field] = acc[curr.field] || [];
          acc[curr.field].push("in.(" + curr.value.map(v => v.toUpperCase()).join(',') + ")");
        }
        else {
          acc[curr.field] = "eq." + curr.value.toUpperCase();
        }
      }
      else if (curr.type === 'in') {
        if (Array.isArray(curr.value)) {
          acc[curr.field] = acc[curr.field] || [];
          acc[curr.field].push("in.(" + curr.value.join(',') + ")");
        }
      }
      else if (curr.type === 'fts') {
        let field = curr.field;
        if (field = "description")
          field = 'ts';
        acc[field] = "wfts." + curr.value;
      }
      else if (curr.type === 'ov') {
        let from = curr.value[0];
        let to = curr.value[1];
        let ff = [];
        if (from)
          ff.push(`${curr.field}.gte.${from}`);
        if (to)
          ff.push(`${curr.field}.lte.${to}`);
        acc['and'] = `(${ff.join(',')})`;
      }
      else {
        console.log("Unknown filter type " + curr.type);
      }

      return acc;
    }, filters);
  }

  return filters;
}
