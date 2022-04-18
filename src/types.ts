export let sources = {
  1: "MUFON",
  2: "NUFORC",
  3: "NICAP",
  4: "UFODNA"
};

export type Report = {
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

export type ReportFormatted = {
  id: number;
  source: string;
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
