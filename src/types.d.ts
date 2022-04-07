export type Report = {
  id: number;
  source: number;
  source_id: string;
  date: string;
  city: string;
  district: string;
  country: string;
  continent?: string;
  water?: string;
  other?: string;
  description: string;
  attachments: string[];
};

export type ReportFormatted = {
  id: number;
  source: string;
  source_id: string;
  date: string;
  city: string;
  district: string;
  country: string;
  continent?: string;
  water?: string;
  other?: string;
  description: string;
  attachments: string[];
};
