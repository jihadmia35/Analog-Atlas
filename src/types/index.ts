export type TargetBody = 'Mars' | 'Moon';

export type AnalogsViewId = 'home' | 'purpose-group' | 'resources';

export type PurposeGroupId = 'rover-mobility' | 'surface-science';

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
  variables: EquationVariable[];
  methodologyOverview: string;
}

export interface MetricValue {
  metricId: string;
  earthValue: number | string;
  planetaryValue: number | string;
  unit: string;
  individualScore: number; // 0 to 100
  notes: string;
}

export interface AnalogSite {
  id: string;
  name: string;
  /** Compact label used in dense UI (map pins, index rows, group cards) */
  shortName: string;
  regionName: string;
  country: string;
  continent: 'South Asia' | 'Iceland' | 'North America' | 'Global';
  coordinates: {
    lat: number;
    lng: number;
    display: string;
  };
  purposeGroup: PurposeGroupId;
  targetBody: TargetBody;
  targetPlanetarySite: string;
  shortSummary: string;
  heroImage: string; // Earth analog photo
  targetImage: string; // Planetary target comparison photo
  heroCaption: string;
  targetCaption: string;
  ecScore: number; // Environmental Correspondence (0-100)
  siScore: number; // Similarity Index (0-100)
  confidencePercentage: number;
  terrainType: string;
  
  // Specific sections required:
  metricValues: MetricValue[];
  evidence: {
    dataSummary: string;
    keyMeasurements: Array<{ parameter: string; earthData: string; planetaryData: string; significance: string }>;
    literatureReview: string;
    publications: Array<{ title: string; authors: string; journal: string; year: number; doi: string; url?: string }>;
  };
  limitations: {
    gravityMismatch: string;
    atmosphericMismatch: string;
    weatheringMismatch: string;
    biologicalInterference: string;
    operationalNotice: string;
  };
  resources: {
    datasets: Array<{ name: string; type: string; source: string; linkText: string }>;
    fieldGuides: Array<{ title: string; institution: string }>;
  };
}

export interface PurposeGroupData {
  id: PurposeGroupId;
  title: string;
  tagline: string;
  iconName: string;
  metrics: MetricDefinition[];
  scoringModel: ScoringModel;
}

export interface FilterState {
  searchQuery: string;
  targetBody: 'All' | 'Mars' | 'Moon';
  purposeGroup: 'All' | PurposeGroupId;
  continent: 'All' | 'South Asia' | 'Iceland' | 'North America';
  minSiScore: number;
}
