export let sourceIdColumn = {
  title: "ID",
  field: "source_id",
  visible: false,
  headerFilter: true,
  headerFilterFunc: "=",
  headerFilterParams: {
    search: true,
    elementAttributes: {
      autocomplete: "no"
    }
  }
};
