// @generated
// Automatically generated. Don't change this file manually.

import { SourceId } from './Source';
import { LocationId } from './Location';

export type ReportId = number & { " __flavor"?: 'report' };

export default interface Report {
  /** Primary key. Index: report_pkey */
  id: ReportId;

  /** Index: report_source_source_id_idx */
  source: SourceId | null;

  /** Index: report_source_source_id_idx */
  source_id: string | null;

  /** Index: report_date_idx */
  date: Date;

  description: string | null;

  location: LocationId | null;

  date_detail: string | null;

  /** Index: report_ts_idx */
  ts: string | null;

  word_count: number | null;
}

export interface ReportInitializer {
  /** Index: report_source_source_id_idx */
  source?: SourceId | null;

  /** Index: report_source_source_id_idx */
  source_id?: string | null;

  /** Index: report_date_idx */
  date: Date;

  description?: string | null;

  location?: LocationId | null;

  date_detail?: string | null;
}
