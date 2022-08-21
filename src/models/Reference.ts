// @generated
// Automatically generated. Don't change this file manually.

export type ReferenceId = number & { " __flavor"?: 'reference' };

export default interface Reference {
  /** Primary key. Index: reference_pkey */
  id: ReferenceId;

  text: string;

  /** Index: reference_hash_key */
  hash: string;
}

export interface ReferenceInitializer {
  text: string;
}
