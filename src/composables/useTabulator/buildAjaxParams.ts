import { buildFilters } from "./buildFilters";
import { reportColumns } from "./columns";

export function buildAjaxParams(
  filter: Record<string, any>[] = [],
  sort: Record<string, any>[] = [],
  page: number = 1,
  size: number = 100
) {
  let order = sort?.map(p => p.field + "." + p.dir).join(",") || undefined;
  let filters = buildFilters(filter);

  let params: Record<string, unknown> = {
    select: reportColumns.join(","),
    order,
    ...filters
  };

  params.offset = (page - 1) * size;
  if (size) params.limit = size;

  return params;
}
