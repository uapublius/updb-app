export let descriptionColumn = {
  title: "Report",
  field: "description",
  tooltip: true,
  minWidth: 72,
  headerSort: false,
  headerFilter: true,
  headerFilterFunc: "fts",
  headerFilterPlaceholder: "Search...",
  headerFilterParams: {
    search: true,
    elementAttributes: {
      id: "header-description-search",
      name: "header-description-search",
      autocomplete: true
    }
  }
};
