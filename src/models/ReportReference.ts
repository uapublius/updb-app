// @generated
// Automatically generated. Don't change this file manually.

import { ReportId } from './Report';
import { ReferenceId } from './Reference';

export default interface ReportReference {
  /**
   * Index: report_reference_report_idx
   * Index: report_reference_report_reference_idx
   */
  report: ReportId;

  /** Index: report_reference_report_reference_idx */
  reference: ReferenceId;
}

export interface ReportReferenceInitializer {
  /**
   * Index: report_reference_report_idx
   * Index: report_reference_report_reference_idx
   */
  report: ReportId;

  /** Index: report_reference_report_reference_idx */
  reference: ReferenceId;
}
