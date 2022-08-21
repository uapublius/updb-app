// @generated
// Automatically generated. Don't change this file manually.

import { ReportId } from './Report';

export type AttachmentId = number & { " __flavor"?: 'attachment' };

export default interface Attachment {
  /** Primary key. Index: attachment_pkey */
  id: AttachmentId;

  /** Index: attachment_url_report_idx */
  url: string;

  /**
   * Index: attachment_report_idx
   * Index: attachment_url_report_idx
   */
  report: ReportId;
}

export interface AttachmentInitializer {
  /** Index: attachment_url_report_idx */
  url: string;

  /**
   * Index: attachment_report_idx
   * Index: attachment_url_report_idx
   */
  report: ReportId;
}
