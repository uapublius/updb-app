// @generated
// Automatically generated. Don't change this file manually.

export type SourceId = number & { " __flavor"?: 'source' };

export default interface Source {
  /** Primary key. Index: source_pkey */
  id: SourceId;

  /** Index: source_name_key */
  name: string;
}

export interface SourceInitializer {
  /** Index: source_name_key */
  name: string;
}
