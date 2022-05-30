declare type Report = {
  id: number;
  location?: number;
  source: number;
  source_id: string;
  date: string;
  date_detail: string;
  city: string;
  district: string;
  country: string;
  water?: string;
  other?: string;
  description: string;
  attachments: string[];
  references: string[];
  snippet?: string;
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

declare type LocationReportSummary = {
  count: number;
  location: number;
  id: number;
  city: number;
  district: number;
  country: number;
  latitude: number;
  longitude: number;
};