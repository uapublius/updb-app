declare type Report = {
  id: number;
  source: number;
  source_id: string;
  date: string;
  date_detail: string;
  city: string;
  district: string;
  country: string;
  continent?: string;
  water?: string;
  other?: string;
  description: string;
  attachments: string[];
  references: string[];
};

declare type PaginationData = {
  last_page: number;
  rowCount: number;
  data: Record<string, any>;
};

declare type HeadTags = {
  title: string;
  link: Record<string, any>;
  meta: Record<string, any>;
};
