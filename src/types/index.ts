export type TargetBody = 'Mars' | 'Moon';

export type AnalogsViewId = 'home' | 'purpose-group' | 'resources';

export type PurposeGroupId = 'rover-mobility' | 'surface-science';

export type Continent = 'South Asia' | 'East Asia' | 'South America' | 'Antarctica';

export interface MetricDefinition {
  id: string;
  name: string;
  symbol: string;
  weight: number; // 0 to 1
  unit: string;
  description: string;
  measurementMethod: string;
  planetaryBaseline: string;
  toleranceVariance: string; // sigma_i
}

export interface EquationVariable {
  symbol: string;
  name: string;
  definition: string;
  typicalRange: string;
}

export interface ScoringModel {
  name: string;
  primaryEquation: string;
  environmentalCorrespondenceEquation: string;
  /** Piecewise rule that defines the per-characteristic score */
  scoringRule?: string;
  variables: EquationVariable[];
  methodologyOverview: string;
}

export interface ReferenceEntry {
  id: string;
  citation: string;
  year: number;
  category: string;
  planetaryTarget: string;
  doi?: string;
  relevance: string;
}

/** Row of the "calculation summary" published alongside a characteristic metric matrix */
export interface CalculationSummaryRow {
  site: string;
  characteristicScores: string[]; // one per characteristic, in matrix order
  si: string;
  ec: string;
  sourceSi?: string;
  sourceEc?: string;
}

export interface CalculationSummary {
  note: string;
  columns: string[];
  rows: CalculationSummaryRow[];
}

export interface MetricValue {
  metricId: string;
  earthValue: string;
  planetaryValue: string;
  unit?: string;
  /** Published per-characteristic score s (0–1). Omitted when the source publishes none. */
  individualScore?: number;
  notes: string;
}

export interface Publication {
  citation: string;
  doi?: string;
}

export interface AnalogSite {
  id: string;
  name: string;
  /** Compact label used in dense UI (map pins, index rows, group cards) */
  shortName: string;
  regionName: string;
  country: string;
  continent: Continent;
  coordinates: {
    lat: number;
    lng: number;
    display: string;
  };
  purposeGroup: PurposeGroupId;
  targetBody: TargetBody;
  targetPlanetarySite: string;
  /** Target line printed under the site title in the source dossier */
  profileLine: string;
  shortSummary: string;
  heroImage: string; // Earth analog photo
  targetImage: string; // Planetary target comparison photo
  heroCaption: string;
  targetCaption: string;
  ecScore: number; // Environmental Correspondence (0-100)
  siScore: number; // Similarity Index (0-100)
  /** How the published SI / EC values were obtained, when the source states it */
  scoreNote?: string;
  terrainType: string;

  // Specific sections required:
  metricValues: MetricValue[];
  evidence: {
    dataSummary: string;
    keyMeasurements: Array<{ parameter: string; earthData: string; planetaryData: string; significance: string }>;
    publications: Publication[];
  };
  /** Terrestrial mismatch disclosures, as published for the site */
  mismatches: Array<{ label: string; text: string }>;
  resources: {
    datasets: Array<{ name: string; type: string; source: string }>;
  };
}

export interface PurposeGroupData {
  id: PurposeGroupId;
  title: string;
  tagline: string;
  iconName: string;
  metrics: MetricDefinition[];
  scoringModel: ScoringModel;
  calculationSummary?: CalculationSummary;
}

export interface FilterState {
  searchQuery: string;
  targetBody: 'All' | 'Mars' | 'Moon';
  purposeGroup: 'All' | PurposeGroupId;
  continent: 'All' | Continent;
  minSiScore: number;
}
