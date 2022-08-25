declare export type PaginationData = {
  last_page: number;
  rowCount: number;
  data: Record<string, any>;
};

declare export type HeadTags = {
  title: string;
  description: string;
  url: string;
  image: string;
  link: Record<string, any>;
  meta: Record<string, any>;
};
