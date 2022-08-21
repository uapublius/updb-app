// @generated
// Automatically generated. Don't change this file manually.

import Attachment, { AttachmentInitializer, AttachmentId } from './Attachment';
import Location, { LocationInitializer, LocationId } from './Location';
import Reference, { ReferenceInitializer, ReferenceId } from './Reference';
import Report, { ReportInitializer, ReportId } from './Report';
import ReportReference, { ReportReferenceInitializer } from './ReportReference';
import Source, { SourceInitializer, SourceId } from './Source';
import ReportReferenceView from './ReportReferenceView';
import ReportView from './ReportView';
import SourceView from './SourceView';

type Model =
  | Attachment
  | Location
  | Reference
  | Report
  | ReportReference
  | Source
  | ReportReferenceView
  | ReportView
  | SourceView

interface ModelTypeMap {
  'attachment': Attachment;
  'location': Location;
  'reference': Reference;
  'report': Report;
  'report_reference': ReportReference;
  'source': Source;
  'report_reference_view': ReportReferenceView;
  'report_view': ReportView;
  'source_view': SourceView;
}

type ModelId =
  | AttachmentId
  | LocationId
  | ReferenceId
  | ReportId
  | SourceId

interface ModelIdTypeMap {
  'attachment': AttachmentId;
  'location': LocationId;
  'reference': ReferenceId;
  'report': ReportId;
  'source': SourceId;
}

type Initializer =
  | AttachmentInitializer
  | LocationInitializer
  | ReferenceInitializer
  | ReportInitializer
  | ReportReferenceInitializer
  | SourceInitializer

interface InitializerTypeMap {
  'attachment': AttachmentInitializer;
  'location': LocationInitializer;
  'reference': ReferenceInitializer;
  'report': ReportInitializer;
  'report_reference': ReportReferenceInitializer;
  'source': SourceInitializer;
}

export type {
  Attachment, AttachmentInitializer, AttachmentId,
  Location, LocationInitializer, LocationId,
  Reference, ReferenceInitializer, ReferenceId,
  Report, ReportInitializer, ReportId,
  ReportReference, ReportReferenceInitializer,
  Source, SourceInitializer, SourceId,
  ReportReferenceView,
  ReportView,
  SourceView,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
