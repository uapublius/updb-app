// @generated
// Automatically generated. Don't change this file manually.

export type LocationId = number & { " __flavor"?: 'location' };

export default interface Location {
  /** Primary key. Index: location_pkey */
  id: LocationId;

  /**
   * City/Town/Village
   * Index: location_city_district_country_idx
   */
  city: string;

  /**
   * State (US)/Province (CA)/Federal District (MX)/County (UK)
   * Index: location_city_district_country_idx
   */
  district: string;

  /**
   * 2-letter country code
   * Index: location_city_district_country_idx
   * Index: location_country_idx
   */
  country: string;

  /** If the report is on a large body of water (e.g. middle of Lake Michigan, or Indian Ocean). If near a coast, please use nearest city. If a large lake, provide country. If international waters, all other fields can be empty. */
  water: string;

  /** Another location e.g. In orbit */
  other: string;

  latitude: string | null;

  longitude: string | null;

  geoname_id: number | null;
}

export interface LocationInitializer {
  /**
   * City/Town/Village
   * Default value: ''::text
   * Index: location_city_district_country_idx
   */
  city?: string;

  /**
   * State (US)/Province (CA)/Federal District (MX)/County (UK)
   * Default value: ''::text
   * Index: location_city_district_country_idx
   */
  district?: string;

  /**
   * 2-letter country code
   * Default value: ''::character varying
   * Index: location_city_district_country_idx
   * Index: location_country_idx
   */
  country?: string;

  /**
   * If the report is on a large body of water (e.g. middle of Lake Michigan, or Indian Ocean). If near a coast, please use nearest city. If a large lake, provide country. If international waters, all other fields can be empty.
   * Default value: ''::text
   */
  water?: string;

  /**
   * Another location e.g. In orbit
   * Default value: ''::text
   */
  other?: string;

  latitude?: string | null;

  longitude?: string | null;

  geoname_id?: number | null;
}
