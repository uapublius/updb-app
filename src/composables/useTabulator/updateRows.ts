export let updateRowsWithAttachments = table => ({ data }) => {
  let attachmentsByReportId = data.reduce((acc, curr) => {
    acc[curr.report] = acc[curr.report] || [];
    if (curr.url.endsWith('.eml')) return acc;
    acc[curr.report].push(curr.url);
    return acc;
  }, {});

  for (let [id, attachments] of Object.entries(attachmentsByReportId)) {
    table.updateData([{ id, attachments }]);
  }
};

export let updateRowsWithReferences = table => ({ data }) => {
  let referencesByReportId = data.reduce((acc, curr) => {
    acc[curr.report] = acc[curr.report] || [];
    acc[curr.report].push(curr.text);
    return acc;
  }, {});

  for (let [id, references] of Object.entries(referencesByReportId)) {
    table.updateData([{ id, references }]);
  }
};
