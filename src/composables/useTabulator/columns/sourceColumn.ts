import { sources } from '@/sources';
import { isNarrow } from '@/lib/util';

export let sourceColumn = {
  title: "Name",
  field: "source",
  visible: !isNarrow,
  formatter: cell => sources[cell.getValue()],
  headerFilter: "select",
  headerFilterFunc: "in",
  headerFilterParams: {
    values: sources,
    multiselect: true,
    elementAttributes: {
      autocomplete: "no"
    }
  }
};
