import { AnalogSite, PurposeGroupData, ReferenceEntry } from '../types';

/* ------------------------------------------------------------------ */
/* Purpose groups                                                      */
/* ------------------------------------------------------------------ */

export const PURPOSE_GROUPS: PurposeGroupData[] = [
  {
    id: 'rover-mobility',
    title: 'Robotic Rover Mobility & Terrain Operations',
    tagline: 'Terramechanics, wheel-soil interaction, steep-slope stability, and obstacle negotiation for planetary rovers.',
    iconName: 'Compass',
    metrics: [
      {
        id: 'slope-grade',
        name: 'Slope & Grade Traverse Angle',
        symbol: '\\theta_{max}',
        weight: 0.25,
        unit: 'degrees (°)',
        description: 'Maximum sustained gradient traversable without catastrophic wheel slippage or roll-over hazards.',
        measurementMethod: 'Terrestrial LiDAR micro-topography & UAV photogrammetric Digital Elevation Models (DEMs).',
        planetaryBaseline: '12° – 31° (Jezero Delta Scarp / Lunar South Pole Crater Slopes)',
        toleranceVariance: '\\sigma_{\\theta} = 4.5°'
      },
      {
        id: 'rock-cfa',
        name: 'Rock Size–Frequency Distribution (CFA)',
        symbol: 'k_{cfa}',
        weight: 0.25,
        unit: 'Cumulative Fraction Area (%)',
        description: 'Areal density and boulder diameter distribution defining obstacle avoidance and chassis clearance limits.',
        measurementMethod: 'Automated 2D/3D segmentation from orthomosaics fitted against Golombek et al. exponential models.',
        planetaryBaseline: '7% – 15% CFA (Mars Pathfinder / Curiosity Gale Crater typical)',
        toleranceVariance: '\\sigma_{cfa} = 2.8'
      },
      {
        id: 'soil-sinkage',
        name: 'Bekker Soil Sinkage Modulus',
        symbol: 'k_c, k_{\\phi}',
        weight: 0.25,
        unit: 'kN/m^(n+1)',
        description: 'Bekker-Wong terramechanical pressure-sinkage moduli determining wheel sinkage depth under rover wheel loads.',
        measurementMethod: 'In-situ bevameter plate penetration testing and dynamic cone penetrometry.',
        planetaryBaseline: '0.8 – 3.2 kN/m^(n+1) (Curiosity wheel slip in Bagnold ripples)',
        toleranceVariance: '\\sigma_{k} = 0.5'
      },
      {
        id: 'shear-strength',
        name: 'Regolith Cohesion & Internal Friction',
        symbol: 'c, \\phi',
        weight: 0.25,
        unit: 'kPa & degrees (°)',
        description: 'Mohr-Coulomb shear strength parameters governing gross traction, drawbar pull, and wheel spinout.',
        measurementMethod: 'Direct shear box apparatus and rotational shear vaning under dry, uncompacted states.',
        planetaryBaseline: 'c = 0.15 – 0.75 kPa, φ = 32° – 42° (Lunar Mare Apollo & Mars Regolith)',
        toleranceVariance: '\\sigma_{c} = 0.18 kPa, \\sigma_{\\phi} = 3.5°'
      }
    ],
    scoringModel: {
      name: 'Planetary Rover Terramechanics Fidelity Model (PRT-FM)',
      primaryEquation:
        'SI = 100\\sum_{i=1}^{4} w_i\\, s_i \\qquad EC = 100\\sum_{i=1}^{4} w_i\\, q_i',
      environmentalCorrespondenceEquation:
        '\\theta_{ridge} = \\arctan\\!\\left(\\frac{h}{w}\\right) \\qquad \\theta_{cone} = \\arctan\\!\\left(\\frac{2h}{w}\\right)',
      scoringRule:
        's_i=\\begin{cases}1 & x_i\\in[x_{\\min},x_{\\max}]\\\\[2pt]\\max\\!\\left(0,\\;1-\\dfrac{d_i}{2\\sigma_i}\\right) & \\text{outside the baseline range}\\\\[2pt]0.5 & \\text{no site data}\\end{cases}',
      variables: [
        {
          symbol: 'w_i',
          name: 'Metric Weighting Factor',
          definition: 'Normalized mission priority weight. The characteristic metric matrix weights the four mobility characteristics equally.',
          typicalRange: '0.25 each'
        },
        {
          symbol: 's_i',
          name: 'Characteristic Score',
          definition: 'Fit of the site reading to the planetary baseline: 1 inside the baseline range, decaying linearly to 0 over two tolerances outside it, and a neutral 0.50 when no site data exists.',
          typicalRange: '0 – 1'
        },
        {
          symbol: 'd_i',
          name: 'Distance to Baseline Bound',
          definition: 'Distance from the site value to the nearest baseline bound.',
          typicalRange: '0 – 2σ'
        },
        {
          symbol: '\\sigma_i',
          name: 'Planetary Variance Tolerance',
          definition: 'Tolerance window beyond which physical fidelity decays. The 2σ decay gives s = 0.50 at one tolerance outside the range and 0 at two.',
          typicalRange: 'Metric dependent'
        },
        {
          symbol: 'q_i',
          name: 'Evidence Weight',
          definition: 'Evidence behind a site value: 1 for a measured value, 0.5 for a value derived from other supplied data, 0 for no data.',
          typicalRange: '0 – 1'
        },
        {
          symbol: '\\theta_{ridge}, \\theta_{cone}',
          name: 'Derived Flank Angle',
          definition: 'Mean flank angle derived from a supplied height and width, rather than a DEM-measured slope.',
          typicalRange: '0° – 45°'
        }
      ],
      methodologyOverview:
        'Each site is scored on the four characteristics at w = 0.25 each; a characteristic with no site data stays neutral (s = 0.50) with zero evidence (q = 0). Slope angles are mean flank angles derived from supplied heights and widths, not DEM-measured slopes. The 2σ decay is an explicit assumption: it gives s = 0.50 at one tolerance outside the range and 0 at two.'
    },
    calculationSummary: {
      note: 'Only Qaidam moves off the neutral score, because the supplied file gives geometry for one of the four characteristics at one site. Rock CFA, Bekker and cohesion/friction need new measurements at all four sites.',
      columns: [
        'Site',
        'Slope s',
        'CFA s',
        'Bekker s',
        'c, φ s',
        'SI (4-metric)',
        'EC (4-metric)',
        'SI in source file (6-metric)',
        'EC in source file (6-metric)'
      ],
      rows: [
        {
          site: 'Qaidam Basin',
          characteristicScores: ['1.00', '0.50', '0.50', '0.50'],
          si: '62.5',
          ec: '12.5%',
          sourceSi: '67.6',
          sourceEc: '77.5%'
        },
        {
          site: 'Puna',
          characteristicScores: ['0.50', '0.50', '0.50', '0.50'],
          si: '50.0',
          ec: '0%',
          sourceSi: '61.3',
          sourceEc: '60%'
        },
        {
          site: 'Chandragup I',
          characteristicScores: ['0.50', '0.50', '0.50', '0.50'],
          si: '50.0',
          ec: '0%',
          sourceSi: '57.5',
          sourceEc: '30%'
        },
        {
          site: 'Baratang',
          characteristicScores: ['0.50', '0.50', '0.50', '0.50'],
          si: '50.0',
          ec: '0%',
          sourceSi: '43.8',
          sourceEc: '47.5%'
        }
      ]
    }
  },
  {
    id: 'surface-science',
    title: 'Surface Science & Resource Investigation',
    tagline: 'Mineralogical fidelity, biosignature preservation, evaporite geochemistry, and lunar/martian subsurface resource analogs.',
    iconName: 'FlaskConical',
    metrics: [
      {
        id: 'mineral-spectroscopy',
        name: 'Mineralogical & VNIR Spectral Match',
        symbol: 'S_{spectral}',
        weight: 0.30,
        unit: 'Spectral Angle Mapper (rad)',
        description: 'Similarity of visible and near-infrared reflectance spectra matching target pyroxenes, olivines, and clay-sulfates.',
        measurementMethod: 'Field ASD portable spectroradiometer (350–2500 nm) matched against CRISM and M3 orbital hyperspectral libraries.',
        planetaryBaseline: 'SAM Angle < 0.12 rad against Jezero Delta / South Pole Aitken',
        toleranceVariance: '\\sigma_{sam} = 0.04 rad'
      },
      {
        id: 'geochem-abundance',
        name: 'Elemental Geochemistry (Mg#, Fe/Mn, Si)',
        symbol: 'G_{chem}',
        weight: 0.25,
        unit: 'Cation Ratio Index',
        description: 'Ratio of primary rock-forming silicates, basaltic primitive indices (Mg#), and low chemical alteration indices (CIA).',
        measurementMethod: 'In-situ portable X-ray Fluorescence (pXRF) and lab Inductively Coupled Plasma Mass Spectrometry (ICP-MS).',
        planetaryBaseline: 'Fe/Mn = 45 - 55 (Lunar), Mg# = 48 - 62 (Martian Shergottite/Gale)',
        toleranceVariance: '\\sigma_{chem} = 6.2'
      },
      {
        id: 'biosig-preservation',
        name: 'Aqueous Geochemistry & Biosignature Potential',
        symbol: 'B_{preserv}',
        weight: 0.25,
        unit: 'TOC & Mineral Host Affinity (0-100)',
        description: 'Capacity of mineral matrices (opalline silica, jarosite, borates, permafrost clay) to preserve taphonomic biosignatures.',
        measurementMethod: 'Total Organic Carbon (TOC) pyrolysis gas chromatography-mass spectrometry (GC-MS) & Raman spectroscopy.',
        planetaryBaseline: 'Silica/Sulfate Matrix analogues to Gusev Home Plate & Gale mudstones',
        toleranceVariance: '\\sigma_{bio} = 8.5'
      },
      {
        id: 'radiation-thermal-range',
        name: 'Thermal Diurnal Cycling & UV Index',
        symbol: '\\Delta T_{diurnal}',
        weight: 0.20,
        unit: 'Kelvin (ΔK) & UV-B flux',
        description: 'Extreme diurnal temperature swings and high ultraviolet radiation flux replicating unshielded planetary conditions.',
        measurementMethod: 'Autonomous meteorological stations and calibrated broadband radiometers.',
        planetaryBaseline: 'ΔT = 80 - 110 K diurnal swing (Mars equatorial / Lunar twilight)',
        toleranceVariance: '\\sigma_{T} = 12 K'
      }
    ],
    scoringModel: {
      name: 'Planetary Geochemical & Astrobiological Analogue Matrix (PGA-AM)',
      primaryEquation:
        'SI = 100\\sum_{j=1}^{4} w_j\\, s_j \\qquad EC = 100\\sum_{j=1}^{4} w_j\\, q_j',
      environmentalCorrespondenceEquation:
        'w_{mineral} = 0.30 \\qquad w_{geochem} = w_{aqueous} = 0.25 \\qquad w_{thermal} = 0.20',
      scoringRule:
        's_j=\\begin{cases}1 & x_j\\in[x_{\\min},x_{\\max}]\\\\[2pt]\\max\\!\\left(0,\\;1-\\dfrac{d_j}{2\\sigma_j}\\right) & \\text{outside the baseline range}\\\\[2pt]0.5 & \\text{no site data}\\end{cases}',
      variables: [
        {
          symbol: 'w_j',
          name: 'Science Investigation Weight',
          definition: 'Scientific weighting prioritized by payload instruments (e.g., Raman, APXS, XRD/CheMin).',
          typicalRange: '0.20 - 0.30'
        },
        {
          symbol: 's_j',
          name: 'Characteristic Score',
          definition: 'Fit of the site reading to the planetary baseline: 1 inside the baseline range, decaying linearly to 0 over two tolerances outside it, and a neutral 0.50 when no site data exists.',
          typicalRange: '0 – 1'
        },
        {
          symbol: 'd_j',
          name: 'Distance to Baseline Bound',
          definition: 'Distance from the site value to the nearest baseline bound.',
          typicalRange: '0 – 2σ'
        },
        {
          symbol: 'q_j',
          name: 'Evidence Weight',
          definition: 'Evidence behind a site value: 1 for a measured value, 0.5 for a value derived from other supplied data, 0 for no data.',
          typicalRange: '0 – 1'
        },
        {
          symbol: '\\sigma_j',
          name: 'Planetary Variance Tolerance',
          definition: 'Tolerance window beyond which physical fidelity decays.',
          typicalRange: 'Metric dependent'
        }
      ],
      methodologyOverview:
        'Each site is scored on the four surface-science characteristics at w = 0.30, 0.25, 0.25 and 0.20. A characteristic with no site data stays neutral (s = 0.50) with zero evidence (q = 0); a measured value carries q = 1 and a value derived from other supplied data carries q = 0.5. Sites with minimal organic soil development and pristine mineralogy serve as primary models for ancient Martian habitability and Lunar volatiles.'
    }
  }
];

/* ------------------------------------------------------------------ */
/* Analog sites                                                        */
/* ------------------------------------------------------------------ */

export const ANALOG_SITES: AnalogSite[] = [
  /* ---------------- GROUP 1: ROBOTIC ROVER MOBILITY ---------------- */
  {
    id: 'qaidam-basin',
    name: 'Qaidam Basin, China',
    shortName: 'Qaidam Basin',
    regionName: 'Qinghai Province',
    country: 'China',
    continent: 'East Asia',
    coordinates: {
      lat: 36.0,
      lng: 94.0,
      display: '36°00′ N, 94°00′ E'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Mars',
    targetPlanetarySite: 'Nili Fossae Ridge Systems',
    profileLine:
      'Mars target · ridge navigation and obstacle mapping · Earth: Qaidam Basin · Mars: Nili Fossae · SI 62.5 · EC 12.5',
    shortSummary:
      'Ridge navigation and obstacle-mapping analog: the yardangs and ridge complexes of the Qaidam Basin stand in for the Nili Fossae ridge systems.',
    heroImage: '/images/qaidam-basin-earth.jpg',
    targetImage: '/images/nili-fossae.jpg',
    heroCaption:
      'Qaidam Basin landscape, Qinghai, China — David Rubin, U.S. Geological Survey / Wikimedia Commons (public domain)',
    targetCaption: 'Nili Fossae, Mars — NASA/JPL/USGS / Wikimedia Commons (public domain)',
    ecScore: 12.5,
    siScore: 62.5,
    scoreNote:
      'SI = 100 × (0.25×1.00 + 0.25×0.50 + 0.25×0.50 + 0.25×0.50) = 62.5.  EC = 100 × (0.25×0.5) = 12.5%.',
    terrainType: 'Eolian Ridge Complex & Yardangs',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: 'Large ridge 4.70 m high × 11.80 m wide gives 21.7°; small ridge 0.80 m × 4.00 m gives 11.3°',
        planetaryValue:
          'Nili Fossae large ridge 4.00 m × 13.40 m gives 16.6°; small ridge 0.50 m × 3.50 m gives 8.1°. Baseline 12°–31°, σ = 4.5°',
        individualScore: 1.0,
        notes:
          'Derived mean flank angle, not a DEM measurement. Earth large ridge sits inside the baseline: s = 1.00, q = 0.5.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: 'Not supplied',
        planetaryValue: 'Baseline 7%–15% CFA, σ = 2.8',
        individualScore: 0.5,
        notes: 'No rock-frequency data in the source file. s = 0.50, q = 0.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: 'Not supplied',
        planetaryValue: 'Baseline 0.8–3.2 kN/m^(n+1), σ = 0.5',
        individualScore: 0.5,
        notes: 'Gypsum up to 96% is reported, but no sinkage test. s = 0.50, q = 0.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'Not supplied',
        planetaryValue: 'c = 0.15–0.75 kPa, φ = 32°–42°; σ_c = 0.18 kPa, σ_φ = 3.5°',
        individualScore: 0.5,
        notes: 'No shear data. s = 0.50, q = 0.'
      }
    ],
    evidence: {
      dataSummary:
        'Mission operations named for this site are rover navigation, 3D terrain mapping, Raman/LIBS analysis, XRD mineral identification and shallow drilling. The Mars terrain model has 0.25 m/pixel resolution.',
      keyMeasurements: [
        {
          parameter: 'Large ridge height/width',
          earthData: '0.40',
          planetaryData: '0.30',
          significance: 'Steeper Earth ridges are a conservative traverse test'
        },
        {
          parameter: 'Small ridge height/width',
          earthData: '0.20',
          planetaryData: '0.14',
          significance: 'Small ridges are the more frequent obstacle'
        },
        {
          parameter: 'Ridge intersection angles',
          earthData: 'Requires further Earth measurement',
          planetaryData: '15°–90°',
          significance: 'Sets turning and path-planning difficulty'
        },
        {
          parameter: 'Gypsum content',
          earthData: 'Up to 96%',
          planetaryData: 'Not definitively confirmed',
          significance: 'Affects surface strength and sinkage'
        }
      ],
      publications: [{ citation: 'None listed in the supplied Mobility Analog Profiles file.' }]
    },
    mismatches: [
      {
        label: 'Derived slopes',
        text: 'Angles come from height and width, so they assume a uniform ridge profile.'
      },
      {
        label: 'Ridge intersections',
        text: 'Earth intersection angles are not yet measured.'
      },
      {
        label: 'Terrain model',
        text: 'Earth terrain-model resolution still needs extraction.'
      },
      {
        label: 'Composition',
        text: 'Martian gypsum is not definitively confirmed.'
      }
    ],
    resources: {
      datasets: [
        {
          name: 'Nili Fossae terrain model (0.25 m/pixel)',
          type: 'Topography',
          source: 'Mars source file'
        }
      ]
    }
  },
  {
    id: 'puna-argentina',
    name: 'Puna, Argentina',
    shortName: 'Puna',
    regionName: 'Puna de Atacama, Catamarca',
    country: 'Argentina',
    continent: 'South America',
    coordinates: {
      lat: -25.0,
      lng: -67.0,
      display: '25°00′ S, 67°00′ W'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Mars',
    targetPlanetarySite: 'Utopia Planitia / Oxia Planum',
    profileLine:
      'Mars target · gravel-bedform mobility · Earth: Puna · Mars: Utopia Planitia / Oxia Planum · SI 50.0 · EC 0',
    shortSummary:
      'Gravel-bedform mobility analog: gravel megaripples and yardangs of the Puna stand in for the transverse aeolian ridges of Utopia and Oxia Planum.',
    heroImage: '/images/puna-earth.jpg',
    targetImage: '/images/mars-draa.jpg',
    heroCaption:
      'Campo de Piedra Pómez, Catamarca, Argentina — Rodolfo Pace / Wikimedia Commons (CC BY 2.0)',
    targetCaption: 'The Draa of Mars, aeolian ridge field — NASA/JPL-Caltech (public domain)',
    ecScore: 0,
    siScore: 50.0,
    scoreNote: 'SI = 100 × (0.25×0.50 × 4) = 50.0.  EC = 100 × (0.25×0 × 4) = 0%.',
    terrainType: 'Gravel Megaripples & Yardangs',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: 'Bedform height not retrieved',
        planetaryValue:
          'Bedform height a few metres, width up to tens of metres; crest cases of 15 cm and 25 cm considered. Baseline 12°–31°, σ = 4.5°',
        individualScore: 0.5,
        notes: 'Heights and widths are not paired, so no angle can be derived. s = 0.50, q = 0.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: 'Gravel-armoured deposits (no CFA value)',
        planetaryValue: 'Baseline 7%–15% CFA, σ = 2.8',
        individualScore: 0.5,
        notes: 'Qualitative only. s = 0.50, q = 0.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: 'Wheel–gravel interaction and slip are named mission tests; no k values',
        planetaryValue: 'Baseline 0.8–3.2 kN/m^(n+1), σ = 0.5',
        individualScore: 0.5,
        notes: 'This site fits the Bekker row best once bevameter data exist. s = 0.50, q = 0.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'Not supplied',
        planetaryValue: 'c = 0.15–0.75 kPa, φ = 32°–42°; σ_c = 0.18 kPa, σ_φ = 3.5°',
        individualScore: 0.5,
        notes: 'No shear data. s = 0.50, q = 0.'
      }
    ],
    evidence: {
      dataSummary:
        'Mission operations named for this site are rover mobility testing, wheel–gravel interaction, bedform crossing, autonomous terrain mapping and slip investigation.',
      keyMeasurements: [
        {
          parameter: 'Landform',
          earthData: 'Gravel megaripples and yardangs',
          planetaryData: 'Transverse aeolian ridges',
          significance: 'Same bedform class for crossing tests'
        },
        {
          parameter: 'Rover crossing threshold',
          earthData: 'Earth measurement needed',
          planetaryData: '15 cm or 25 cm crests considered',
          significance: 'Defines the obstacle height to test'
        },
        {
          parameter: 'Surface material',
          earthData: 'Gravel-armoured deposits',
          planetaryData: 'Martian sediment and gravel bedforms',
          significance: 'Drives wheel slip and sinkage'
        },
        {
          parameter: 'Elevation / rainfall',
          earthData: 'About 4,000 m; under 300 mm per year',
          planetaryData: 'Not directly comparable',
          significance: 'Context only'
        }
      ],
      publications: [{ citation: 'None listed in the supplied Mobility Analog Profiles file.' }]
    },
    mismatches: [
      {
        label: 'Missing Earth geometry',
        text: 'Megaripple height and wavelength must be measured before a quantitative comparison.'
      },
      {
        label: 'Crossing thresholds',
        text: 'The 15 cm and 25 cm values are cases considered, not a confirmed universal rover limit.'
      },
      {
        label: 'Climate',
        text: 'Rainfall and elevation are not directly comparable with the Mars values.'
      }
    ],
    resources: { datasets: [] }
  },
  {
    id: 'chandragup-i',
    name: 'Chandragup I, Pakistan',
    shortName: 'Chandragup I',
    regionName: 'Chandragup Hills, Sindh',
    country: 'Pakistan',
    continent: 'South Asia',
    coordinates: {
      lat: 25.4,
      lng: 66.6,
      display: '25°24′ N, 66°36′ E'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Mars',
    targetPlanetarySite: 'Utopia Planitia Cones',
    profileLine:
      'Mars target · cone mapping and terrain navigation · Earth: Chandragup I · Mars: Utopia Planitia · SI 50.0 · EC 0',
    shortSummary:
      'Cone mapping and terrain-navigation analog: the mud-volcano cones of Chandragup I stand in for the conical mounds of Utopia Planitia.',
    heroImage: '/images/chandragup-earth.jpg',
    targetImage: '/images/utopia-mud-volcanoes.jpg',
    heroCaption:
      'Chandragup I mud volcano, Sindh, Pakistan — Ahsan Mansoor Khan / Wikimedia Commons (CC BY-SA 4.0)',
    targetCaption:
      'Candidate mud volcanoes in Utopia Planitia, Mars — NASA/JPL-Caltech/MSSS (public domain)',
    ecScore: 0,
    siScore: 50.0,
    scoreNote: 'SI = 100 × (0.25×0.50 × 4) = 50.0.  EC = 100 × (0.25×0 × 4) = 0%.',
    terrainType: 'Mud-Volcano Cones',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: 'Cone about 90 m high; base width not established',
        planetaryValue:
          'Cones 10–100 m high on 200–1,100 m bases give 5.7° (10 m on 200 m) to 10.3° (100 m on 1,100 m). Baseline 12°–31°, σ = 4.5°',
        individualScore: 0.5,
        notes:
          'No Earth angle can be derived without a base width, so the site stays neutral. The Mars values sit at or below the baseline’s low edge. s = 0.50, q = 0.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: 'Not supplied',
        planetaryValue: 'Baseline 7%–15% CFA, σ = 2.8',
        individualScore: 0.5,
        notes: 'No rock-frequency data. s = 0.50, q = 0.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: 'Mud and fluid deposits (no k values)',
        planetaryValue:
          'Possible mud-volcanic deposits; baseline 0.8–3.2 kN/m^(n+1), σ = 0.5',
        individualScore: 0.5,
        notes: 'Soft mud suggests low k, but nothing is measured. s = 0.50, q = 0.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'Not supplied',
        planetaryValue: 'c = 0.15–0.75 kPa, φ = 32°–42°; σ_c = 0.18 kPa, σ_φ = 3.5°',
        individualScore: 0.5,
        notes: 'No shear data. s = 0.50, q = 0.'
      }
    ],
    evidence: {
      dataSummary:
        'Mission operations named for this site are rover cone mapping, cone-height measurement, remote gas sensing, sediment sampling, subsurface radar and autonomous terrain classification.',
      keyMeasurements: [
        {
          parameter: 'Cone height',
          earthData: 'About 90 m',
          planetaryData: '10–100 m',
          significance: 'Scale match for traverse planning'
        },
        {
          parameter: 'Base width',
          earthData: 'Not established',
          planetaryData: '200–1,100 m',
          significance: 'Needed to turn height into a flank angle'
        },
        {
          parameter: 'Subsurface investigation',
          earthData: 'Requires site-specific survey',
          planetaryData: 'Radar layers to about 80 m',
          significance: 'Informs load-bearing depth'
        },
        {
          parameter: 'Gas',
          earthData: 'Methane-rich fluids reported regionally',
          planetaryData: 'No equivalent active emission measurement',
          significance: 'Context, not one of the four metrics'
        }
      ],
      publications: [{ citation: 'None listed in the supplied Mobility Analog Profiles file.' }]
    },
    mismatches: [
      {
        label: 'Cone height',
        text: 'The 90 m Earth value needs primary-source verification.'
      },
      {
        label: 'Missing Earth data',
        text: 'Base width, surface temperature and pH are not established.'
      },
      {
        label: 'Gas report',
        text: 'The methane-rich-fluid report is regional, not a site-specific emission measurement.'
      },
      {
        label: 'Slope pairing',
        text: 'The Mars height and width ranges are not paired, so 5.7° and 10.3° are illustrative cases (the unpaired extremes would be 1.0° and 45°).'
      }
    ],
    resources: { datasets: [] }
  },
  {
    id: 'baratang-mud-volcanoes',
    name: 'Baratang Mud Volcano Field, India',
    shortName: 'Baratang',
    regionName: 'Baratang Island, Andaman & Nicobar',
    country: 'India',
    continent: 'South Asia',
    coordinates: {
      lat: 12.05,
      lng: 92.65,
      display: '12°03′ N, 92°39′ E'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Mars',
    targetPlanetarySite: 'Chryse and Acidalia Planitiae',
    profileLine:
      'Mars target · irregular terrain mapping · Earth: Baratang · Mars: Chryse and Acidalia Planitiae · SI 50.0 · EC 0',
    shortSummary:
      'Irregular terrain-mapping analog: the mud-volcano field of Baratang stands in for the pitted cones of Chryse and Acidalia Planitiae.',
    heroImage: '/images/baratang-earth.jpg',
    targetImage: '/images/chryse-pitted-cones.jpg',
    heroCaption:
      'Mud volcano, Baratang Island, Andaman Island, India — Harvinder Chandigarh / Wikimedia Commons (CC BY-SA 4.0)',
    targetCaption: 'Pitted cones, Chryse Planitia, Mars — NASA/JPL-Caltech/MSSS (public domain)',
    ecScore: 0,
    siScore: 50.0,
    scoreNote: 'SI = 100 × (0.25×0.50 × 4) = 50.0.  EC = 100 × (0.25×0 × 4) = 0%.',
    terrainType: 'Mud-Volcano Cones & Cratered Plain',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: 'Central mound about 2 m high; width not supplied',
        planetaryValue: 'Site-specific values not extracted. Baseline 12°–31°, σ = 4.5°',
        individualScore: 0.5,
        notes: 'No width, so no angle. s = 0.50, q = 0.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: 'Not supplied',
        planetaryValue: 'Baseline 7%–15% CFA, σ = 2.8',
        individualScore: 0.5,
        notes: 'No rock-frequency data. s = 0.50, q = 0.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: 'Mud, water, sandstone and shale (no k values)',
        planetaryValue:
          'Possible mud-volcanic deposits; baseline 0.8–3.2 kN/m^(n+1), σ = 0.5',
        individualScore: 0.5,
        notes: 'Material is soft and wet, so sinkage is likely high, but nothing is measured. s = 0.50, q = 0.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'Not supplied',
        planetaryValue: 'c = 0.15–0.75 kPa, φ = 32°–42°; σ_c = 0.18 kPa, σ_φ = 3.5°',
        individualScore: 0.5,
        notes: 'Wet mud is not comparable to dry, uncompacted regolith. s = 0.50, q = 0.'
      }
    ],
    evidence: {
      dataSummary:
        'Mission operations named for this site are robotic cone mapping, remote gas detection, sediment sampling, terrain classification and autonomous navigation around irregular landforms.',
      keyMeasurements: [
        {
          parameter: 'Landform',
          earthData: 'Mud-volcano cones',
          planetaryData: 'Pitted cones',
          significance: 'Same obstacle class for navigation tests'
        },
        {
          parameter: 'Central mound height',
          earthData: 'About 2 m',
          planetaryData: 'Not extracted',
          significance: 'Small-scale obstacle for a rover'
        },
        {
          parameter: 'Material',
          earthData: 'Mud, water, sandstone and shale',
          planetaryData: 'Possible mud-volcanic deposits',
          significance: 'Governs sinkage and cohesion'
        },
        {
          parameter: 'Surface temperature / pH',
          earthData: '29.39–30.07 °C; 8.0–8.3',
          planetaryData: 'No equivalent measurement',
          significance: 'Context, not one of the four metrics'
        }
      ],
      publications: [{ citation: 'None listed in the supplied Mobility Analog Profiles file.' }]
    },
    mismatches: [
      {
        label: 'Missing Mars data',
        text: 'Site-specific central-mound measurements were not extracted.'
      },
      {
        label: 'Active vents',
        text: 'Mars has no equivalent active-vent temperature or surface-fluid pH measurement.'
      },
      {
        label: 'Interpretation',
        text: 'Ancient fluid and gas activity on Mars is an interpretation, not a direct measurement.'
      }
    ],
    resources: { datasets: [] }
  },

  /* ------------- GROUP 2: SURFACE SCIENCE & RESOURCE INVESTIGATION ---- */
  {
    id: 'beacon-valley',
    name: 'Beacon Valley, Antarctica',
    shortName: 'Beacon Valley',
    regionName: 'McMurdo Dry Valleys, Victoria Land',
    country: 'Antarctica',
    continent: 'Antarctica',
    coordinates: {
      lat: -77.8167,
      lng: 160.65,
      display: '77°49′ S, 160°39′ E'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Mars',
    targetPlanetarySite: 'Mars Mid-Latitude Ice',
    profileLine: 'Mars target · ice-rich permafrost · 77°49′ S, 160°39′ E · SI 50.0 · EC 0',
    shortSummary:
      'Ice-rich permafrost analog for Mars mid-latitude ice: massive ground ice lies beneath a sublimation residue in the central Beacon Valley.',
    heroImage: '/images/beacon-valley-earth.jpg',
    targetImage: '/images/beacon-valley-mars.jpg',
    heroCaption: 'Beacon Valley, Antarctica — Figure 1, Final Analog Data for Surface Science',
    targetCaption: 'Mars mid-latitude ice — Figure 2, Final Analog Data for Surface Science',
    ecScore: 0,
    siScore: 50.0,
    terrainType: 'Ice-Cored Permafrost & Sublimation Till',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'Massive ground ice beneath sublimation till; approximately 10 wt% mineral debris.',
        planetaryValue: 'Dodo-Goldilocks ice (>99 wt% ice) and Snow White material (30 ± 20 wt% ice).',
        notes:
          'No matched VNIR spectra; the Jezero/SPA baseline does not suit an ice target. Mullins-sector till is largely Ferrar Dolerite and Beacon Heights Orthoquartzite (Shean & Marchant).'
      },
      {
        metricId: 'geochem-abundance',
        earthValue:
          'Approximately 10 wt% mineral debris; perchlorate at approximately 0.4–0.6 wt% in soil.',
        planetaryValue: '—',
        notes: 'Soil perchlorate is not the elemental composition of the ice.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue: 'Ground ice occurs beneath approximately 30–50 cm of sublimation till.',
        planetaryValue: 'Subsurface ice and perchlorate-bearing soil.',
        notes:
          'The metric does not measure ice detection or ice-table geometry. Soil organic carbon: 13.1 ± 2.9 μmol C/g soil. Equivalent to approximately 0.0157 ± 0.0035 wt% carbon. Surface soil, 0–10 cm.'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: 'MAAT about −22.9 °C, with temperatures recorded for a decade down to 19.6 m',
        planetaryValue: 'MAAT of approximately −22.9 °C is supported.',
        notes: 'Mean annual temperature is not a diurnal swing.'
      }
    ],
    evidence: {
      dataSummary:
        'Central Beacon Valley has massive ground ice beneath a sublimation residue and is a recognised Mars analog for subsurface ice. Ground-penetrating radar and seismic surveys found 80–110 m of ice in upper Mullins Valley and 150 m in upper Beacon Valley. Central-valley ice is partly remnant Taylor Glacier ice, a different body from the upper-valley ice.',
      keyMeasurements: [
        {
          parameter: 'Ice thickness',
          earthData: '80–110 m (upper Mullins); 150 m (upper Beacon)',
          planetaryData: 'Utopia deposit 80–170 m (Stuurman et al., unverified)',
          significance: 'Thickness-scale comparison only; not depth to ice'
        },
        {
          parameter: 'Cover over ice',
          earthData: 'Decimeters of dry regolith; 30–50 cm and 0.30 m residue unverified',
          planetaryData: 'Varies by Mars deposit',
          significance: 'Radar interpretation and excavation planning'
        },
        {
          parameter: 'Debris in ice',
          earthData: '~10 wt% (unverified)',
          planetaryData: 'Dust- and rock-bearing ice',
          significance: 'Dielectric and thermal properties'
        },
        {
          parameter: 'Mean annual temperature',
          earthData: 'About −22.9 to −23 °C',
          planetaryData: 'Location- and season-dependent',
          significance: 'Cold-environment context, not a temperature match'
        }
      ],
      publications: [
        { citation: 'Liu, Sletten, Hallet & Waddington (2018), JGR Earth Surface 123(8), 1797–1810.' },
        { citation: 'Shean & Marchant (2010), J. Glaciology 56(195), 48–64.' },
        { citation: 'Barrett et al. (2007), Biogeochemical Stoichiometry of Antarctic Dry Valley Ecosystems.' },
        { citation: 'Bramson et al. (2015), Widespread Excess Ice in Arcadia Planitia, Mars.' },
        {
          citation:
            'Stuurman et al. (2016), SHARAD Detection and Characterization of Subsurface Water Ice Deposits in Utopia Planitia.'
        }
      ]
    },
    mismatches: [
      {
        label: 'Atmosphere and pressure',
        text: 'A denser Earth atmosphere changes sublimation, heat transfer and exposed-ice behaviour.'
      },
      { label: 'Gravity', text: 'Earth gravity is not representative of Mars.' },
      {
        label: 'Ice composition',
        text: 'Beacon Valley ice and debris cannot be assumed to match every Martian excess-ice deposit.'
      },
      {
        label: 'Thermal regime',
        text: 'Cold is not equivalent to the Martian surface cycle; compare depth- and season-matched data.'
      },
      {
        label: 'Geographic variability',
        text: 'Central-site and upper-valley measurements are not interchangeable.'
      }
    ],
    resources: {
      datasets: [{ name: 'NASA PDS SHARAD archive', type: 'Archive', source: 'NASA Planetary Data System' }]
    }
  },
  {
    id: 'miyake-jima',
    name: 'Miyake-jima, Japan',
    shortName: 'Miyake-jima',
    regionName: 'Izu Islands, Tokyo Metropolis',
    country: 'Japan',
    continent: 'East Asia',
    coordinates: {
      lat: 34.09,
      lng: 139.53,
      display: '34°05′ N, 139°32′ E'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Moon',
    targetPlanetarySite: 'Lunar Highlands Crust',
    profileLine:
      'Lunar target · high-calcic plagioclase / ferroan anorthosite · Izu Islands · SI 57.5 · EC 15',
    shortSummary:
      'High-calcic plagioclase and ferroan anorthosite analog for lunar highland crust: near-uniform anorthite megacrysts in island-arc basaltic lava flows.',
    heroImage: '/images/miyake-jima-earth.jpg',
    targetImage: '/images/moon-highlands-crater.jpg',
    heroCaption: 'Miyake-jima, Izu Islands, Japan — Figure 3, Final Analog Data for Surface Science',
    targetCaption: 'Moon highlands crust — Figure 4, Final Analog Data for Surface Science',
    ecScore: 15,
    siScore: 57.5,
    terrainType: 'Island-Arc Basaltic Lava Flows & Anorthite Megacrysts',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'An95.51 ± 0.31; NIR feature near 1.25 μm; TIR CF at 1233.9 and 1275.6 cm⁻¹.',
        planetaryValue: 'Highly calcic, around An94–98.',
        notes:
          'Composition matches closely. Needs matched arrays against M3 before a SAM score.'
      },
      {
        metricId: 'geochem-abundance',
        earthValue:
          'Seven analyzed grains; mean Li 0.31 ppm, K 44.01 ppm, Na 3,510 ppm, and Ti 37.29 ppm.',
        planetaryValue: 'Lunar ferroan anorthosite and high-magnesium/high-alkali suites',
        notes:
          'The authors report overlap or depletion relative to lunar suites in most minor elements.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue: 'Island-arc volcanic setting',
        planetaryValue: 'Lunar highland plagioclase is the target material.',
        notes: 'Aqueous geochemistry and biosignatures do not directly measure this mineralogical match.'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: 'No site dataset',
        planetaryValue: 'Lunar equatorial midday approximately 387–397 K; pre-sunrise approximately 95 K.',
        notes: 'Lunar values are equatorial benchmarks, not specific highland measurements.'
      }
    ],
    evidence: {
      dataSummary:
        'Roy et al. (2025) describe near-uniform high-calcic anorthite megacrysts in basaltic lava flows on an island-arc volcano. The crystals are xenocrysts entrained by the erupting magma. Pulverised crystals have been used as an experimental starting material for lunar crustal suites.',
      keyMeasurements: [
        {
          parameter: 'Anorthite composition',
          earthData: 'An95.51 ± 0.31 (core mean)',
          planetaryData: 'About An95 lunar crust; Apollo range An94.8–97.1 unverified',
          significance: 'Direct mineral-chemistry comparison'
        },
        {
          parameter: 'Crystal homogeneity',
          earthData: 'Lack of typical magmatic zoning',
          planetaryData: 'Lunar sample mineral chemistry',
          significance: 'Repeatable calibration'
        },
        {
          parameter: 'Spectral coverage',
          earthData: 'NIR and TIR measured',
          planetaryData: 'Lunar orbital mineral spectra',
          significance: 'Instrument and library comparison'
        },
        {
          parameter: 'Grain count',
          earthData: 'Seven analysed grains (unverified)',
          planetaryData: '—',
          significance: 'Representativeness limit'
        }
      ],
      publications: [
        {
          citation: 'Roy, Mallik, Donaldson Hanna, Goepfert & Hervig (2025), American Mineralogist 110, 154–170.'
        }
      ]
    },
    mismatches: [
      {
        label: 'Geological setting',
        text: 'The crystals sit in basaltic flows, not an anorthositic crustal outcrop.'
      },
      {
        label: 'Regolith',
        text: 'No lunar regolith, impact glass, agglutinates or solar-wind implantation.'
      },
      {
        label: 'Atmosphere and weathering',
        text: 'Humid terrestrial alteration does not operate on the airless Moon.'
      },
      {
        label: 'Thermal and radiation',
        text: 'Earth lacks lunar vacuum, radiation and swing.'
      },
      { label: 'Sampling', text: 'A handful of grains cannot represent the island.' }
    ],
    resources: {
      datasets: [
        {
          name: 'Supplementary data, University of Arizona figshare',
          type: 'Supplementary data',
          source: 'University of Arizona'
        },
        {
          name: 'NASA PDS Moon Mineralogy Mapper archive',
          type: 'Archive',
          source: 'NASA Planetary Data System'
        },
        { name: 'NASA PDS LRO data', type: 'Archive', source: 'NASA Planetary Data System' }
      ]
    }
  },
  {
    id: 'sittampundi',
    name: 'Sittampundi Anorthosite Complex, India',
    shortName: 'Sittampundi',
    regionName: 'Namakkal district, Tamil Nadu',
    country: 'India',
    continent: 'South Asia',
    coordinates: {
      lat: 11.02,
      lng: 78.02,
      display: '11°01′ N, 78°01′ E'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Moon',
    targetPlanetarySite: 'Lunar Highlands Regolith',
    profileLine:
      'Lunar target · highland anorthosite and regolith engineering · Namakkal district, Tamil Nadu · SI 50.0 · EC 15',
    shortSummary:
      'Highland anorthosite and regolith-engineering analog: the source complex of the LSS-ISAC-1 simulant used to test the Chandrayaan-2 lander and rover.',
    heroImage: '/images/sittampundi-earth.jpg',
    targetImage: '/images/moon-highlands-regolith.jpg',
    heroCaption: 'Sittampundi Anorthosite Complex, Tamil Nadu, India — Figure 5, Final Analog Data for Surface Science',
    targetCaption: 'Moon highlands regolith — Figure 6, Final Analog Data for Surface Science',
    ecScore: 15,
    siScore: 50.0,
    terrainType: 'Anorthosite Complex, Chromitite & Pyroxenite',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'Plagioclase An80–100; An99–100 in anorthosite hosting chromite.',
        planetaryValue: 'Lunar highland plagioclase about An95',
        notes: 'A processed simulant would likely score higher.'
      },
      {
        metricId: 'geochem-abundance',
        earthValue: 'LSS-ISAC-1: SiO₂ 43.61–46.60%, Al₂O₃ 29.85–31.77%, CaO 16.28–16.96%.',
        planetaryValue: 'SiO₂ 45.16%, Al₂O₃ 27.66%, CaO 15.63%.',
        notes: 'The authors report close equivalence of major oxides to lunar highland anorthosite.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue: 'Archean metamorphosed terrane',
        planetaryValue: 'Lunar highland regolith is the target reference.',
        notes: 'This metric is not a direct measure of anorthosite suitability.'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: 'No site dataset',
        planetaryValue: 'Lunar equatorial midday approximately 387–397 K; pre-sunrise approximately 95 K.',
        notes: 'Airless, extreme lunar swing.'
      }
    ],
    evidence: {
      dataSummary:
        'Anbazhagan et al. (2021) identify the Sittampundi Anorthosite Complex as the source of LSS-ISAC-1. The processed simulant was used at ISRO’s Lunar Terrain Testing Facility in Bengaluru, which tested soft landing of the lander and mobility of the rover for Chandrayaan-2. The complex is Neoarchean, with a minimum emplacement age of 2522 ± 12 Ma.',
      keyMeasurements: [
        {
          parameter: 'Plagioclase composition',
          earthData: 'An80–100',
          planetaryData: 'Highly calcic lunar highland plagioclase',
          significance: 'Direct mineral comparison'
        },
        {
          parameter: 'Plagioclase abundance',
          earthData: 'Anorthosite >60 vol% of complex; "85–90%" unverified',
          planetaryData: 'Lunar highland mineralogy',
          significance: 'Bulk comparison'
        },
        {
          parameter: 'Simulant properties',
          earthData: 'Grain size and phases characterized (LSS-ISAC-1)',
          planetaryData: 'Apollo 16 soil',
          significance: 'Mobility and material testing'
        },
        {
          parameter: 'Chemistry',
          earthData: 'Major oxides reported as close to lunar highlands',
          planetaryData: 'Apollo 16',
          significance: 'Needs same oxide basis and method'
        }
      ],
      publications: [
        { citation: 'Anbazhagan et al. (2021), Icarus 366, 114511.' },
        {
          citation:
            'Venugopal et al. (2020), Planet. Space Sci. 194, 105116, and Adv. Space Res. 66(11), 2711–2721.'
        },
        { citation: 'Subramaniam (1956), GSA Bulletin 67(3), 317–390.' },
        { citation: 'Dutta et al. (2011), Ore Geology Reviews.' }
      ]
    },
    mismatches: [
      {
        label: 'Impact processing',
        text: 'Natural anorthosite lacks impact glass, agglutinates and space-weathered grains.'
      },
      {
        label: 'Geological variability',
        text: 'Anorthosite, gabbro, chromitite and pyroxenite must not be treated as one material.'
      },
      {
        label: 'Metamorphism and weathering',
        text: 'Late retrogression and terrestrial alteration can lower An content and change surfaces.'
      },
      {
        label: 'Rock versus simulant',
        text: 'Simulant properties do not transfer to every outcrop.'
      },
      {
        label: 'Testing location',
        text: 'Chandrayaan-2 tests ran at the Bengaluru facility, not at the source complex.'
      }
    ],
    resources: {
      datasets: [
        {
          name: 'NASA PDS lunar sample and LRO archives',
          type: 'Archive',
          source: 'NASA Planetary Data System'
        }
      ]
    }
  },
  {
    id: 'lonar-crater',
    name: 'Lonar Crater, India',
    shortName: 'Lonar Crater',
    regionName: 'Buldhana district, Maharashtra',
    country: 'India',
    continent: 'South Asia',
    coordinates: {
      lat: 19.9667,
      lng: 76.5167,
      display: '19°58′ N, 76°31′ E'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Mars',
    targetPlanetarySite: 'Martian Basaltic Craters',
    profileLine:
      'Mars target · basaltic impact and hydrothermal alteration · 19°58′ N, 76°31′ E · SI 50.0 · EC 15',
    shortSummary:
      'Basaltic impact and hydrothermal alteration analog: a 1.8 km crater in Deccan basalt with post-impact hydrothermal alteration in drilled floor cores.',
    heroImage: '/images/lonar-crater-earth.jpg',
    targetImage: '/images/mars-basaltic-crater.jpg',
    heroCaption: 'Lonar Crater, Maharashtra, India — Figure 7, Final Analog Data for Surface Science',
    targetCaption: 'Mars basaltic crater — Figure 8, Final Analog Data for Surface Science',
    ecScore: 15,
    siScore: 50.0,
    terrainType: 'Impact Crater in Deccan Basalt, Hydrothermal Breccia',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'Saponite primary, minor celadonite and carbonate.',
        planetaryValue: 'Saponite identified on Mars',
        notes:
          'Published TIR comparison supports mineralogical analogy; no matched VNIR comparison or numerical SAM angle reported.'
      },
      {
        metricId: 'geochem-abundance',
        earthValue:
          'Shocked impact melt: SiO₂ 49.33–50.69%, FeO 8.64–8.77%, MgO 5.03–5.10%. Calculated Mg# 0.399–0.402',
        planetaryValue:
          'SiO₂ approximately 45–50 wt%, FeO approximately 15–20 wt%, and MgO approximately 5–10 wt%',
        notes:
          'Earth values describe shocked impact melts, not necessarily the hydrothermally altered breccia samples.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue:
          'Post-impact hydrothermal alteration documented; no silica/sulfate or TOC data',
        planetaryValue:
          'Mawrth Vallis Fe/Mg-smectites and hydrated silica indicate past aqueous alteration.',
        notes:
          'Similar alteration products/processes do not establish identical geological histories; Water TOC: 0.002 ± 0.0003 g/L. Sediment TOC: 0.25 ± 0.05 g/L'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: '130–200 °C is a modelled formation range; no diurnal or UV data',
        planetaryValue: 'Gale Crater diurnal ground-temperature amplitude is approximately 60–90 K.',
        notes: 'The model estimate is not a measured fluid temperature or a diurnal swing.'
      }
    ],
    evidence: {
      dataSummary:
        'Hagerty & Newsom (2003) describe a 1.8 km crater in Deccan basalt with drilled floor cores of basaltic impact breccia altered by post-impact hydrothermal processes. They conclude Lonar represents a lower size limit for impact-induced hydrothermal activity.',
      keyMeasurements: [
        {
          parameter: 'Crater diameter',
          earthData: 'About 1.8 km (1.88 km in later work)',
          planetaryData: 'Choose a Mars crater of similar size',
          significance: 'Avoids misleading scale comparisons'
        },
        {
          parameter: 'Target rock',
          earthData: 'Deccan basalt',
          planetaryData: 'Martian basaltic crust',
          significance: 'Lithological comparison'
        },
        {
          parameter: 'Primary alteration mineral',
          earthData: 'Saponite',
          planetaryData: 'Saponite on Mars',
          significance: 'Secondary-mineral comparison'
        },
        {
          parameter: 'Alteration temperature',
          earthData: 'Modelled 130–200 °C (upper bound seen truncated)',
          planetaryData: 'No universal Mars value',
          significance: 'Process model, not a measurement'
        },
        {
          parameter: 'Crater age',
          earthData: 'About 50,000 yr (2003); 37.5 ± 5.0 ka (2014); 570 ± 47 ka (40Ar/39Ar, 2011)',
          planetaryData: 'Not directly relevant',
          significance: 'Estimates conflict; cite which study supplies the age and do not average'
        }
      ],
      publications: [
        { citation: 'Hagerty & Newsom (2003), Meteoritics & Planetary Science 38(3), 365–381.' },
        { citation: 'Jourdan, Moynier, Koeberl & Eroglu (2011), Geology 39(7), 671–674.' },
        {
          citation:
            'Nakamura et al. (2014), Geochemistry, Geophysics, Geosystems, DOI 10.1002/2014GC005376.',
          doi: '10.1002/2014GC005376'
        },
        {
          citation:
            'Paul et al. (2016), Exploration of Microbial Diversity and Community Structure of Lonar Lake.'
        }
      ]
    },
    mismatches: [
      {
        label: 'Crater scale',
        text: 'Restrict Mars comparisons to similar size classes or to mineralogical and process analogies.'
      },
      {
        label: 'Hydrothermal history',
        text: 'Terrestrial fluid chemistry, duration, and temperature may differ from Mars.'
      },
      {
        label: 'Modern lake',
        text: 'Present-day lake chemistry is not the ancient hydrothermal system.'
      },
      {
        label: 'Age uncertainty',
        text: 'Published ages disagree by more than an order of magnitude.'
      },
      {
        label: 'Mineral proportions',
        text: 'No quantitative abundance comparison with a chosen Mars target yet.'
      }
    ],
    resources: {
      datasets: [
        { name: 'NASA PDS CRISM archive', type: 'Archive', source: 'NASA Planetary Data System' },
        { name: 'NASA PDS HiRISE archive', type: 'Archive', source: 'NASA Planetary Data System' }
      ]
    }
  }
];

/* ------------------------------------------------------------------ */
/* Reference library                                                   */
/* ------------------------------------------------------------------ */

export const REFERENCE_LIBRARY: ReferenceEntry[] = [
  {
    id: 'ref-1',
    citation:
      'Liu, Sletten, Hallet & Waddington (2018), JGR Earth Surface 123(8), 1797–1810.',
    year: 2018,
    category: 'Surface Science',
    planetaryTarget: 'Mars (mid-latitude ice)',
    relevance: 'Ground ice beneath sublimation till in Beacon Valley and the radar-derived ice thickness used for comparison.'
  },
  {
    id: 'ref-2',
    citation: 'Shean & Marchant (2010), J. Glaciology 56(195), 48–64.',
    year: 2010,
    category: 'Surface Science',
    planetaryTarget: 'Mars (mid-latitude ice)',
    relevance: 'Mullins-sector till lithology — Ferrar Dolerite and Beacon Heights Orthoquartzite — in the Beacon Valley mineralogy row.'
  },
  {
    id: 'ref-3',
    citation: 'Barrett et al. (2007), Biogeochemical Stoichiometry of Antarctic Dry Valley Ecosystems.',
    year: 2007,
    category: 'Surface Science',
    planetaryTarget: 'Mars (biosignature potential)',
    relevance: 'Soil organic carbon budget behind the Beacon Valley biosignature row.'
  },
  {
    id: 'ref-4',
    citation: 'Bramson et al. (2015), Widespread Excess Ice in Arcadia Planitia, Mars.',
    year: 2015,
    category: 'Surface Science',
    planetaryTarget: 'Mars (excess ice)',
    relevance: 'Martian excess-ice deposits used as the planetary reference for subsurface-ice analogs.'
  },
  {
    id: 'ref-5',
    citation:
      'Stuurman et al. (2016), SHARAD Detection and Characterization of Subsurface Water Ice Deposits in Utopia Planitia.',
    year: 2016,
    category: 'Surface Science',
    planetaryTarget: 'Mars (Utopia ice)',
    relevance: 'Utopia deposit thickness range (80–170 m) quoted as the planetary reference for the ice-thickness comparison.'
  },
  {
    id: 'ref-6',
    citation:
      'Roy, Mallik, Donaldson Hanna, Goepfert & Hervig (2025), American Mineralogist 110, 154–170.',
    year: 2025,
    category: 'Surface Science',
    planetaryTarget: 'Moon (highlands crust)',
    relevance: 'Near-uniform high-calcic anorthite megacrysts at Miyake-jima and their use as a lunar crustal starting material.'
  },
  {
    id: 'ref-7',
    citation: 'Anbazhagan et al. (2021), Icarus 366, 114511.',
    year: 2021,
    category: 'Surface Science',
    planetaryTarget: 'Moon (highland regolith)',
    relevance: 'Identification of Sittampundi as the source of the LSS-ISAC-1 lunar simulant.'
  },
  {
    id: 'ref-8',
    citation:
      'Venugopal et al. (2020), Planet. Space Sci. 194, 105116, and Adv. Space Res. 66(11), 2711–2721.',
    year: 2020,
    category: 'Surface Science',
    planetaryTarget: 'Moon (highland regolith)',
    relevance: 'Major-oxide characterisation of the Sittampundi simulant against lunar highland anorthosite.'
  },
  {
    id: 'ref-9',
    citation: 'Subramaniam (1956), GSA Bulletin 67(3), 317–390.',
    year: 1956,
    category: 'Surface Science',
    planetaryTarget: 'Moon (highland anorthosite)',
    relevance: 'Foundational geological description of the Sittampundi anorthosite complex.'
  },
  {
    id: 'ref-10',
    citation: 'Dutta et al. (2011), Ore Geology Reviews.',
    year: 2011,
    category: 'Surface Science',
    planetaryTarget: 'Moon (highland anorthosite)',
    relevance: 'Chromitite and pyroxenite phases within the complex that must not be pooled with the anorthosite.'
  },
  {
    id: 'ref-11',
    citation: 'Hagerty & Newsom (2003), Meteoritics & Planetary Science 38(3), 365–381.',
    year: 2003,
    category: 'Surface Science',
    planetaryTarget: 'Mars (basaltic craters)',
    relevance: 'Post-impact hydrothermal alteration in drilled floor cores at Lonar and the lower size limit it implies.'
  },
  {
    id: 'ref-12',
    citation: 'Jourdan, Moynier, Koeberl & Eroglu (2011), Geology 39(7), 671–674.',
    year: 2011,
    category: 'Surface Science',
    planetaryTarget: 'Mars (basaltic craters)',
    relevance: '40Ar/39Ar crater age for Lonar — one of the conflicting published ages.'
  },
  {
    id: 'ref-13',
    citation:
      'Nakamura et al. (2014), Geochemistry, Geophysics, Geosystems, DOI 10.1002/2014GC005376.',
    doi: '10.1002/2014GC005376',
    year: 2014,
    category: 'Surface Science',
    planetaryTarget: 'Mars (basaltic craters)',
    relevance: 'Shock-metamorphosed impact melt chemistry (SiO₂, FeO, MgO, Mg#) at Lonar.'
  },
  {
    id: 'ref-14',
    citation:
      'Paul et al. (2016), Exploration of Microbial Diversity and Community Structure of Lonar Lake.',
    year: 2016,
    category: 'Surface Science',
    planetaryTarget: 'Mars (biosignature potential)',
    relevance: 'Microbial community structure of the modern crater lake, a terrestrial control on any biosignature claim.'
  }
];
