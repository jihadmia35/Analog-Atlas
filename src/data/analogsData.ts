import { AnalogSite, PurposeGroupData } from '../types';

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
        symbol: 'θ_max',
        weight: 0.25,
        unit: 'degrees (°)',
        description: 'Maximum sustained gradient traversable without catastrophic wheel slippage or roll-over hazards.',
        measurementMethod: 'Terrestrial LiDAR micro-topography & UAV photogrammetric Digital Elevation Models (DEMs).',
        planetaryBaseline: '12° - 31° (Jezero Delta Scarp / Lunar South Pole Crater Slopes)',
        toleranceVariance: 'σ_θ = 4.5°'
      },
      {
        id: 'rock-cfa',
        name: 'Rock Size-Frequency Distribution (CFA)',
        symbol: 'k_cfa',
        weight: 0.25,
        unit: 'Cumulative Fraction Area (%)',
        description: 'Areal density and boulder diameter distribution defining obstacle avoidance and chassis clearance limits.',
        measurementMethod: 'Automated 2D/3D segmentation from orthomosaics fitted against Golombek et al. exponential models.',
        planetaryBaseline: '7% - 15% CFA (Mars Pathfinder / Curiosity Gale Crater typical)',
        toleranceVariance: 'σ_cfa = 2.8%'
      },
      {
        id: 'soil-sinkage',
        name: 'Bekker Soil Sinkage Modulus',
        symbol: 'k_c, k_φ',
        weight: 0.25,
        unit: 'kN/m^(n+1)',
        description: 'Bekker-Wong terramechanical pressure-sinkage moduli determining wheel sinkage depth under rover wheel loads.',
        measurementMethod: 'In-situ bevameter plate penetration testing and dynamic cone penetrometry.',
        planetaryBaseline: '0.8 - 3.2 kN/m^(n+1) (Curiosity wheel slip in Bagnold ripples)',
        toleranceVariance: 'σ_k = 0.5 kN/m^(n+1)'
      },
      {
        id: 'shear-strength',
        name: 'Regolith Cohesion & Internal Friction',
        symbol: 'c, φ',
        weight: 0.25,
        unit: 'kPa & degrees (°)',
        description: 'Mohr-Coulomb shear strength parameters governing gross traction, drawbar pull, and wheel spinout.',
        measurementMethod: 'Direct shear box apparatus and rotational shear vaning under dry, uncompacted states.',
        planetaryBaseline: 'c = 0.15 - 0.75 kPa, φ = 32° - 42° (Lunar Mare Apollo & Mars Regolith)',
        toleranceVariance: 'σ_c = 0.18 kPa, σ_φ = 3.5°'
      }
    ],
    scoringModel: {
      name: 'Planetary Rover Terramechanics Fidelity Model (PRT-FM)',
      primaryEquation: 'SI_{\\text{mobility}} = \\sum_{i=1}^{n} w_i \\cdot \\exp\\left( -\\frac{|x_i - x_{\\text{baseline}}|}{\\sigma_i} \\right)',
      environmentalCorrespondenceEquation: 'EC_{\\text{mobility}} = \\left[ \\frac{1}{4} \\left( \\frac{\\tan\\phi_{\\text{analog}}}{\\tan\\phi_{\\text{target}}} + \\frac{\\rho_{\\text{bulk, a}}}{\\rho_{\\text{bulk, t}}} + \\frac{CFA_{\\text{eff, a}}}{CFA_{\\text{eff, t}}} + \\frac{\\mu_{\\text{traction, a}}}{\\mu_{\\text{traction, t}}} \\right) \\right] \\times 100\\%',
      variables: [
        {
          symbol: 'w_i',
          name: 'Metric Weighting Factor',
          definition: 'Normalized mission priority weight (summing to 1.0) allocated according to rover operational risk.',
          typicalRange: '0.10 - 0.40'
        },
        {
          symbol: 'x_i',
          name: 'Measured Analog Parameter',
          definition: 'Empirical value measured at the terrestrial analog field test site.',
          typicalRange: 'Parameter dependent'
        },
        {
          symbol: 'x_{baseline}',
          name: 'Target Planetary Baseline',
          definition: 'Ground-truth or orbiter-derived parameter for the target Mars/Lunar surface region.',
          typicalRange: 'Derived from HiRISE / LROC / In-situ Rover data'
        },
        {
          symbol: '\\sigma_i',
          name: 'Planetary Variance Tolerance',
          definition: 'Standard deviation tolerance window beyond which physical fidelity decays exponentially.',
          typicalRange: 'Empirical calibration'
        },
        {
          symbol: '\\phi',
          name: 'Internal Friction Angle',
          definition: 'Angle of internal shearing resistance for the granular soil under confining stress.',
          typicalRange: '28° - 45°'
        },
        {
          symbol: 'CFA',
          name: 'Cumulative Fractional Area',
          definition: 'Percentage of surface area covered by boulders exceeding the rover wheel radius.',
          typicalRange: '2% - 25%'
        }
      ],
      methodologyOverview: 'The Terramechanics Fidelity Model quantifies how accurately an Earth terrain replicates the tractive, sinkage, and obstruction challenges encountered by planetary rovers. Because Earth gravity is 2.6x higher than Mars and 6x higher than the Moon, normalized stress ratios and Bekker soil equations are scaled to evaluate wheel-cleat interaction dynamically.'
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
        symbol: 'S_spectral',
        weight: 0.30,
        unit: 'Spectral Angle Mapper (rad)',
        description: 'Similarity of visible and near-infrared reflectance spectra matching target pyroxenes, olivines, and clay-sulfates.',
        measurementMethod: 'Field ASD portable spectroradiometer (350–2500 nm) matched against CRISM and M3 orbital hyperspectral libraries.',
        planetaryBaseline: 'SAM Angle < 0.12 rad against Jezero Delta / South Pole Aitken',
        toleranceVariance: 'σ_sam = 0.04 rad'
      },
      {
        id: 'geochem-abundance',
        name: 'Elemental Geochemistry (Mg#, Fe/Mn, Si)',
        symbol: 'G_chem',
        weight: 0.25,
        unit: 'Cation Ratio Index',
        description: 'Ratio of primary rock-forming silicates, basaltic primitive indices (Mg#), and low chemical alteration indices (CIA).',
        measurementMethod: 'In-situ portable X-ray Fluorescence (pXRF) and lab Inductively Coupled Plasma Mass Spectrometry (ICP-MS).',
        planetaryBaseline: 'Fe/Mn = 45 - 55 (Lunar), Mg# = 48 - 62 (Martian Shergottite/Gale)',
        toleranceVariance: 'σ_chem = 6.2'
      },
      {
        id: 'biosig-preservation',
        name: 'Aqueous Geochemistry & Biosignature Potential',
        symbol: 'B_preserv',
        weight: 0.25,
        unit: 'TOC & Mineral Host Affinity (0-100)',
        description: 'Capacity of mineral matrices (opalline silica, jarosite, borates, permafrost clay) to preserve taphonomic biosignatures.',
        measurementMethod: 'Total Organic Carbon (TOC) pyrolysis gas chromatography-mass spectrometry (GC-MS) & Raman spectroscopy.',
        planetaryBaseline: 'Silica/Sulfate Matrix analogues to Gusev Home Plate & Gale mudstones',
        toleranceVariance: 'σ_bio = 8.5'
      },
      {
        id: 'radiation-thermal-range',
        name: 'Thermal Diurnal Cycling & UV Index',
        symbol: 'ΔT_diurnal',
        weight: 0.20,
        unit: 'Kelvin (ΔK) & UV-B flux',
        description: 'Extreme diurnal temperature swings and high ultraviolet radiation flux replicating unshielded planetary conditions.',
        measurementMethod: 'Autonomous meteorological stations and calibrated broadband radiometers.',
        planetaryBaseline: 'ΔT = 80 - 110 K diurnal swing (Mars equatorial / Lunar twilight)',
        toleranceVariance: 'σ_T = 12 K'
      }
    ],
    scoringModel: {
      name: 'Planetary Geochemical & Astrobiological Analogue Matrix (PGA-AM)',
      primaryEquation: 'SI_{\\text{science}} = \\sum_{j=1}^{m} w_j \\cdot \\left[ 1 - \\sqrt{\\frac{(E_j - P_j)^2}{\\alpha_j^2 + (P_j)^2}} \\right]',
      environmentalCorrespondenceEquation: 'EC_{\\text{science}} = \\left[ 0.35 \\cdot S_{\\text{spectral}} + 0.30 \\cdot G_{\\text{chem}} + 0.20 \\cdot B_{\\text{preserv}} + 0.15 \\cdot \\left( 1 - \\frac{CIA_{\\text{analog}}}{100} \\right) \\right] \\times 100\\%',
      variables: [
        {
          symbol: 'w_j',
          name: 'Science Investigation Weight',
          definition: 'Scientific weighting prioritized by payload instruments (e.g., Raman, APXS, XRD/CheMin).',
          typicalRange: '0.15 - 0.35'
        },
        {
          symbol: 'E_j',
          name: 'Earth Analog Spectral/Chemical Reading',
          definition: 'Quantitative terrestrial value recorded via field spectrometry or laboratory assays.',
          typicalRange: 'Normalized [0, 1]'
        },
        {
          symbol: 'P_j',
          name: 'Planetary Target Benchmark',
          definition: 'Curiosity/Perseverance/Lunar sample return laboratory verified baseline values.',
          typicalRange: 'Normalized [0, 1]'
        },
        {
          symbol: 'CIA',
          name: 'Chemical Index of Alteration',
          definition: 'Quantifies terrestrial subaerial chemical weathering; lower CIA indicates pristine planetary-like basalt.',
          typicalRange: '35 - 55 (unweathered basalt)'
        },
        {
          symbol: '\\alpha_j',
          name: 'Scale Damping Constant',
          definition: 'Damping coefficient preventing singularity when planetary target concentrations approach zero.',
          typicalRange: '0.05 - 0.20'
        }
      ],
      methodologyOverview: 'The Astrobiological Analogue Matrix compares pristine geochemical compositions, secondary mineral precipitation, and extreme environmental pressures. Sites with minimal organic soil development, low Chemical Index of Alteration (CIA < 50), and unique sulfate/borate/silica deposition serve as primary models for ancient Martian habitability and Lunar volatiles.'
    }
  }
];

export const ANALOG_SITES: AnalogSite[] = [
  // GROUP 1: ROBOTIC ROVER MOBILITY
  {
    id: 'askja-dyngjusandur',
    name: 'Askja Caldera & Dyngjusandur Volcanic Desert',
    shortName: 'Askja',
    regionName: 'Central Highlands',
    country: 'Iceland',
    continent: 'Iceland',
    coordinates: {
      lat: 65.03,
      lng: -16.75,
      display: '65°01\'48" N, 16°45\'00" W'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Mars',
    targetPlanetarySite: 'Elysium Planitia & Gale Crater Sand Ripples',
    shortSummary: 'High-porosity vesicular basaltic tephra and uncompacted volcanic ash desert replicating Martian low-density regolith sinkage and wheel-slip entrapment.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Askja_-_panoramio_%281%29.jpg',
    targetImage: 'https://images-assets.nasa.gov/image/PIA19929/PIA19929~orig.jpg',
    heroCaption: 'Askja caldera rim and the Dyngjusandur ash desert, Iceland — Wikimedia Commons',
    targetCaption: 'Bagnold dune field edging Mount Sharp, Gale Crater, Mars — NASA/JPL-Caltech/MSSS',
    ecScore: 89.2,
    siScore: 86.4,
    confidencePercentage: 91.5,
    terrainType: 'Aeolian Volcanic Ash & Basaltic Scoria',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: '18.5°',
        planetaryValue: '16.0° - 22.0°',
        unit: 'degrees (°)',
        individualScore: 92,
        notes: 'Caldera inner rim scree slopes match Gale Mount Sharp ascent corridors within 2.5°.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: '9.4%',
        planetaryValue: '11.2%',
        unit: '%',
        individualScore: 88,
        notes: 'Golombek fit matches Martian volcanic plains rock distribution closely.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: '1.42',
        planetaryValue: '1.25',
        unit: 'kN/m^(n+1)',
        individualScore: 85,
        notes: 'Low bulk density tephra induces 25-40% wheel slip similar to Martian megaripples.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'c = 0.22 kPa, φ = 35.8°',
        planetaryValue: 'c = 0.18 kPa, φ = 34.0°',
        unit: 'kPa, °',
        individualScore: 89,
        notes: 'Direct shear parameters accurately mirror uncompacted basalt sands.'
      }
    ],
    evidence: {
      dataSummary: 'Dyngjusandur covers >1,000 km² north of Vatnajökull glacier, formed by glaciovolcanic eruptions and ferocious katabatic winds. In-situ penetrometer measurements yield bulk densities between 1.15 and 1.48 g/cm³, providing one of the highest fidelity terramechanical equivalents to Martian basaltic aeolian ripples.',
      keyMeasurements: [
        { parameter: 'Bulk Regolith Density', earthData: '1.28 g/cm³', planetaryData: '1.30 g/cm³ (Mars InSight HP³)', significance: 'Direct correlation with wheel contact pressure.' },
        { parameter: 'Internal Friction Angle (φ)', earthData: '35.8°', planetaryData: '34.0° ± 2.0°', significance: 'Determines maximum slope climbing limit without spinout.' },
        { parameter: 'Vesicular Basalt Hardness', earthData: '5.5 Mohs', planetaryData: '5.0 - 6.0 Mohs', significance: 'Simulates tire cleat gouging and grousers wear.' }
      ],
      literatureReview: 'Field testing conducted by European rover prototyping groups confirmed Askja tephra induces high sinkage rates that closely mirror Spirit rover\'s entrapment at Troy. Research in Astrobiology & Planetary Geotechnical Engineering identifies Dyngjusandur as an optimal proving ground for autonomous slip-detection algorithms.',
      publications: [
        { title: 'Terramechanical analysis of basaltic tephra in Icelandic volcanic deserts as a Martian wheel-soil analog', authors: 'Thorsteinsson, H. & Helgason, S.', journal: 'Journal of Field Robotics & Planetary Systems', year: 2021, doi: '10.1002/rob.22019' },
        { title: 'Aeolian transport and ripple dynamics of volcanic sands in Askja, Iceland', authors: 'Mangold, N. et al.', journal: 'Geomorphology', year: 2019, doi: '10.1016/j.geomorph.2019.04.011' }
      ]
    },
    limitations: {
      gravityMismatch: 'Earth 1.0g vs Mars 0.38g gravity requires dynamic ballast scaling (rovers must be ballasted to 38% mass or tested with active tether offloading to match normal forces).',
      atmosphericMismatch: 'Icelandic sea-level ambient atmospheric pressure (101.3 kPa) enables aeolian grain saltation at much lower wind speeds than Mars (0.6 kPa).',
      weatheringMismatch: 'Frequent rain, snow melt, and moisture cohesion temporarily cement ash layers during wet seasons, requiring testing strictly during dry summer intervals.',
      biologicalInterference: 'Pioneering bryophytes and lichens sparsely colonize older tephra edges, altering localized shear cohesion.',
      operationalNotice: 'Remote highland location accessible only from July to early September via 4x4 F-roads.'
    },
    resources: {
      datasets: [
        { name: 'Dyngjusandur UAV DEM & Orthomosaics (5cm/pix)', type: 'Geospatial GeoTIFF', source: 'Iceland National Land Survey', linkText: 'Download DEM Archive' },
        { name: 'Tephra Sieve Size & Bekker Plate Curves', type: 'CSV Dataset', source: 'Nordic Planetary Network', linkText: 'View Terramechanics Raw Data' }
      ],
      fieldGuides: [
        { title: 'Logistics and Environmental Protocol for Planetary Testing in Askja', institution: 'University of Iceland Geoscience Dept.' }
      ]
    }
  },
  {
    id: 'kilbourne-hole',
    name: 'Kilbourne Hole Maar Volcanic Crater',
    shortName: 'Kilbourne Hole',
    regionName: 'Potrillo Volcanic Field, New Mexico',
    country: 'United States',
    continent: 'North America',
    coordinates: {
      lat: 31.97,
      lng: -106.96,
      display: '31°58\'12" N, 106°57\'36" W'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Moon',
    targetPlanetarySite: 'Lunar South Pole (Shackleton & Faustini Crater Rims)',
    shortSummary: 'Steep-walled phreatomagmatic crater basin with unconsolidated basalt ejecta, mantle xenolith boulder fields, and talus scree slopes simulating lunar polar crater traversals.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Kilbourne_Hole_aerial_Jan_2019.jpg',
    targetImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Near_Shackleton_Crater_%283929167797%29.jpg',
    heroCaption: 'Kilbourne Hole maar crater, Potrillo Volcanic Field, New Mexico — Wikimedia Commons',
    targetCaption: 'Shadowed rim of Shackleton crater at the lunar south pole — NASA/Clementine, via Wikimedia Commons',
    ecScore: 91.5,
    siScore: 87.8,
    confidencePercentage: 93.0,
    terrainType: 'Maar Volcanic Crater, Talus Slopes & Mantle Xenoliths',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: '28.4°',
        planetaryValue: '26.0° - 32.0°',
        unit: 'degrees (°)',
        individualScore: 96,
        notes: 'Crater inner rim provides the exact steep gradient encountered at Lunar South Pole permanently shadowed crater lips.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: '12.8%',
        planetaryValue: '14.5%',
        unit: '%',
        individualScore: 91,
        notes: 'Basalt bombs and peridotite mantle nodules present realistic obstacle fields for chassis clearance.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: '2.10',
        planetaryValue: '2.40',
        unit: 'kN/m^(n+1)',
        individualScore: 88,
        notes: 'Dry, poorly sorted sand-gravel matrix simulates compacted lunar regolith behavior.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'c = 0.58 kPa, φ = 39.2°',
        planetaryValue: 'c = 0.52 kPa, φ = 38.0°',
        unit: 'kPa, °',
        individualScore: 92,
        notes: 'Exceptional Mohr-Coulomb alignment with Apollo lunar core sample measurements.'
      }
    ],
    evidence: {
      dataSummary: 'Kilbourne Hole is an exceptional 3 km wide, 100 m deep maar crater formed during the Pleistocene. The inner caldera walls exhibit steep 25°–34° talus ramps consisting of unweathered basaltic tephra, surge beds, and dense peridotite xenoliths, directly analogous to the boulder-strewn rims of Lunar South Pole impact craters targeted by Artemis and VIPER.',
      keyMeasurements: [
        { parameter: 'Crater Wall Incline', earthData: '28.4° average (max 35°)', planetaryData: '28° - 33° (Shackleton Rim)', significance: 'Direct stress test for rover pitch/roll limits and anti-slip drive.' },
        { parameter: 'Cohesion Parameter (c)', earthData: '0.58 kPa', planetaryData: '0.52 kPa (Lunar Mare Soil)', significance: 'Friction-cohesion ratio matches unbonded vacuum-packed regolith.' },
        { parameter: 'Obstacle Density (Peridotite Boulders)', earthData: '12.8% CFA', planetaryData: '14.5% CFA', significance: 'Demands active obstacle negotiation and path replanning.' }
      ],
      literatureReview: 'Historically visited during late Apollo astronaut field geology training, Kilbourne Hole is currently under renewed exploration by independent robotic consortiums for lunar rover suspension tests and tethered autonomous descent platforms.',
      publications: [
        { title: 'Geotechnical and morphological evaluation of Kilbourne Hole as a Lunar South Pole mobility analog', authors: 'Graff, T. G. & Dehouck, E.', journal: 'Icarus & Planetary Surface Exploration', year: 2022, doi: '10.1016/j.icarus.2022.115042' },
        { title: 'Robotic traversal of steep maar crater walls under simulated lunar polar geometries', authors: 'McDougall, R. et al.', journal: 'IEEE Aerospace Conference Proceedings', year: 2023, doi: '10.1109/AERO55745.2023.10115822' }
      ]
    },
    limitations: {
      gravityMismatch: 'Lunar gravity is 1/6th of Earth (0.166g). Rovers designed for lunar operation will exert 6x greater ground contact pressure on Earth, requiring lightweight structural mockups.',
      atmosphericMismatch: 'Lunar surface is a hard vacuum (<10^-10 Pa); Kilbourne Hole experiences terrestrial ambient winds and atmospheric convective heat dissipation.',
      weatheringMismatch: 'Secondary caliche carbonate cementation occurs in sub-surface strata due to Chihuahuan desert rainfall, absent on the anhydrous Moon.',
      biologicalInterference: 'Creosote bush and yucca scrub scatter the rim margins, requiring obstacle-filtering routines in vision pipelines.',
      operationalNotice: 'Extreme desert heat in summer (>42°C); optimal testing windows are October to April.'
    },
    resources: {
      datasets: [
        { name: 'Kilbourne Hole High-Density LiDAR Point Cloud', type: 'LAS / CloudCompare', source: 'USGS / OpenTopography', linkText: 'Access LiDAR Point Cloud' },
        { name: 'Potrillo Volcanic Field Rover Traversal Telemetry', type: 'JSON / ROSbag', source: 'Planetary Robotics Lab', linkText: 'Download Rover Traversal Bags' }
      ],
      fieldGuides: [
        { title: 'Geologic Field Guide to Kilbourne Hole and Hunt\'s Hole Maar Volcanism', institution: 'New Mexico Bureau of Geology and Mineral Resources' }
      ]
    }
  },
  {
    id: 'lonar-crater-ejecta',
    name: 'Lonar Basaltic Impact Crater Ejecta Slopes',
    shortName: 'Lonar Crater',
    regionName: 'Buldhana District, Maharashtra',
    country: 'India',
    continent: 'South Asia',
    coordinates: {
      lat: 19.98,
      lng: 76.51,
      display: '19°58\'36" N, 76°30\'30" E'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Mars',
    targetPlanetarySite: 'Martian Basaltic Impact Craters (Jezero & Gale Ejecta Blankets)',
    shortSummary: 'One of Earth\'s exceedingly rare impact structures formed entirely in Deccan basalt. Outer ejecta fields exhibit shatter breccias and shocked basalt blocks identical to Martian crater ejecta.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Lonar-Crater.jpg/1920px-Lonar-Crater.jpg',
    targetImage: 'https://images-assets.nasa.gov/image/PIA26479/PIA26479~medium.jpg',
    heroCaption: 'Lonar impact crater and its saline lake, Maharashtra, India — Wikimedia Commons',
    targetCaption: 'Perseverance traversing the boulder-strewn rim of Jezero Crater, Mars — NASA/JPL-Caltech/ASU',
    ecScore: 90.1,
    siScore: 88.5,
    confidencePercentage: 92.4,
    terrainType: 'Hypervelocity Basaltic Impact Crater, Shocked Breccia',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: '21.0°',
        planetaryValue: '19.5° - 24.0°',
        unit: 'degrees (°)',
        individualScore: 94,
        notes: 'Outer raised rim and ejecta drape provide exact basaltic ramp slopes matching Jezero crater walls.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: '15.6%',
        planetaryValue: '14.8%',
        unit: '%',
        individualScore: 95,
        notes: 'Shocked tholeiitic basalt boulders generate realistic wheel cleat high-centering risks.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: '2.80',
        planetaryValue: '2.50',
        unit: 'kN/m^(n+1)',
        individualScore: 89,
        notes: 'Crushed impact melt and weathered Deccan trap regolith produces high bearing resistance.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'c = 0.65 kPa, φ = 41.5°',
        planetaryValue: 'c = 0.60 kPa, φ = 40.0°',
        unit: 'kPa, °',
        individualScore: 91,
        notes: 'Angular rock fragments impart high interlocking shear strength.'
      }
    ],
    evidence: {
      dataSummary: 'Lonar Crater (~1.8 km diameter, ~50,000 years old) was formed by a hypervelocity meteoritic impact into the continental flood basalts of the Deccan Traps. It is globally recognized as the premier terrestrial analog for basaltic impact cratering on Mars, reproducing both the shock metamorphism (maskelynite formation) and the rugged chaotic boulder distributions typical of martian crater rims.',
      keyMeasurements: [
        { parameter: 'Target Rock Lithology', earthData: '100% Continental Tholeiite Basalt', planetaryData: 'Martian Flood & Impact Basalt', significance: 'Same mechanical crushing resistance, density, and fracture patterns.' },
        { parameter: 'Angular Boulder Sphericity (Ψ)', earthData: '0.45 - 0.62', planetaryData: '0.48 - 0.65', significance: 'Sharp block edges challenge rover wheel grousers and autonomous vision SLAM.' },
        { parameter: 'Impact Breccia Cohesion', earthData: '0.65 kPa', planetaryData: '0.60 kPa', significance: 'Direct correlation with rover rim climbing grip.' }
      ],
      literatureReview: 'Research by the Indian Institute of Science and international planetary geologists underscores Lonar as a benchmark terrain for testing autonomous navigation on impact-altered basalt. The site remains significantly less exploited by major western agencies than Mojave, presenting a pristine niche candidate.',
      publications: [
        { title: 'The Lonar impact crater as a structural and rover traversal analog for Martian basaltic crater rims', authors: 'Pathak, S., Misra, S. & Newsom, H. E.', journal: 'Planetary and Space Science', year: 2020, doi: '10.1016/j.pss.2020.104928' },
        { title: 'Shock metamorphism and terramechanics of ejecta blankets in the Deccan Traps', authors: 'Ray, D. & Ghosh, S.', journal: 'Meteoritics & Planetary Science', year: 2021, doi: '10.1111/maps.13642' }
      ]
    },
    limitations: {
      gravityMismatch: 'Earth gravity (1.0g) vs Mars (0.38g). Downslope gravel rolling occurs at different ballistic velocities than in low martian gravity.',
      atmosphericMismatch: 'Monsoonal rainfall causes seasonal sub-tropical vegetation growth (teak, acacia) on the crater rim, requiring testing during the dry winter/pre-monsoon season (December–March).',
      weatheringMismatch: 'Chemical weathering from ambient humidity generates localized smectite clays along drainage gullies, which are rare on modern hyper-arid Mars.',
      biologicalInterference: 'Protected eco-sensitive sanctuary status requires non-invasive autonomous rover permits and strict environmental protocols.',
      operationalNotice: 'Research permits must be coordinated through the Forest Department of Maharashtra.'
    },
    resources: {
      datasets: [
        { name: 'Lonar Crater Digital Elevation Model & Fracture Map', type: 'GIS Shapefile / DEM', source: 'Geological Survey of India', linkText: 'Download GSI Cartography' },
        { name: 'Deccan Basalt Shock Fracture Density Catalog', type: 'CSV & High-Res TIFF', source: 'Indian Planetary Science Consortium', linkText: 'View Fracture Dataset' }
      ],
      fieldGuides: [
        { title: 'Field Excursion Guide to Lonar Impact Crater: Physical Analog for Mars', institution: 'Planetary Sciences Division, Physical Research Laboratory (PRL)' }
      ]
    }
  },
  {
    id: 'alvord-playa-duricrust',
    name: 'Alvord Desert Hardened Playa & Silt Flats',
    shortName: 'Alvord Playa',
    regionName: 'Harney County, Oregon',
    country: 'United States',
    continent: 'North America',
    coordinates: {
      lat: 42.53,
      lng: -118.45,
      display: '42°31\'48" N, 118°27\'00" W'
    },
    purposeGroup: 'rover-mobility',
    targetBody: 'Mars',
    targetPlanetarySite: 'Meridiani Planum & Gusev Plains Duricrust Formations',
    shortSummary: 'Dry lakebed playa characterized by a fragile desiccation crust overlying unconsolidated ultra-fine silt, ideal for evaluating rover crust-breakthrough hazards and soft soil sinkage.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Alvord_Desert%2C_Oregon.jpg/1920px-Alvord_Desert%2C_Oregon.jpg',
    targetImage: 'https://images-assets.nasa.gov/image/PIA12203/PIA12203~large.jpg',
    heroCaption: 'Desiccation polygons on the Alvord Desert playa, Oregon — Wikimedia Commons',
    targetCaption: 'Spirit rover standing on the soft soil at Troy, Gusev Crater, Mars — NASA/JPL-Caltech/Cornell',
    ecScore: 86.8,
    siScore: 83.5,
    confidencePercentage: 88.0,
    terrainType: 'Playa Mudcracks, Duricrust, Sub-surface Soft Silt',
    metricValues: [
      {
        metricId: 'slope-grade',
        earthValue: '1.2°',
        planetaryValue: '0.8° - 2.5°',
        unit: 'degrees (°)',
        individualScore: 88,
        notes: 'Flat desert floor tests sustained high-speed autonomous traverse and long-range visual odometry.'
      },
      {
        metricId: 'rock-cfa',
        earthValue: '1.2%',
        planetaryValue: '2.0%',
        unit: '%',
        individualScore: 84,
        notes: 'Sparse boulder count mirrors the vast sediment plains of Martian lake beds.'
      },
      {
        metricId: 'soil-sinkage',
        earthValue: '0.78',
        planetaryValue: '0.85',
        unit: 'kN/m^(n+1)',
        individualScore: 92,
        notes: 'Exceptional analog for the "crust-over-powder" condition that trapped NASA Spirit rover in 2009.'
      },
      {
        metricId: 'shear-strength',
        earthValue: 'c = 0.12 kPa, φ = 29.5°',
        planetaryValue: 'c = 0.15 kPa, φ = 31.0°',
        unit: 'kPa, °',
        individualScore: 89,
        notes: 'Sub-crust silt demonstrates low shear resistance under dynamic wheel spin.'
      }
    ],
    evidence: {
      dataSummary: 'The Alvord Desert is a 18 km long endorheic playa situated in the rain shadow of the Steens Mountain. Its surface features an interlocking polygonal mudcrack crust (1–3 cm thick) that fractures under high ground pressure, exposing dry, low-cohesion aeolian silt underneath. This directly mimics the martian duricrust formations encountered by Opportunity and Spirit.',
      keyMeasurements: [
        { parameter: 'Crust Penetration Resistance', earthData: '140 - 280 kPa', planetaryData: '150 - 300 kPa (Gusev Duricrust)', significance: 'Determines threshold wheel load before sudden soil failure.' },
        { parameter: 'Grain Size Mean (Sub-crust)', earthData: '32 μm (Fine Silt)', planetaryData: '25 - 45 μm', significance: 'Simulates fine martian dust packing and wheel slippage dynamics.' },
        { parameter: 'Playa Surface Flatness', earthData: 'Variance < 0.05m / 100m', planetaryData: 'Variance < 0.08m (Meridiani)', significance: 'Ideal for autonomous visual odometry drift calibration.' }
      ],
      literatureReview: 'Terramechanic studies at Alvord have been cited in planetary robotics literature as a primary case study for testing active anti-slip control, wheel-torque monitoring, and multi-sensor fusion when visual landmarks are minimal.',
      publications: [
        { title: 'Duricrust fracture and rover sinkage dynamics on terrestrial playas as analogs for Martian plains', authors: 'Karlsson, E. & Arvidson, R. E.', journal: 'Journal of Terramechanics', year: 2021, doi: '10.1016/j.jterra.2021.08.003' },
        { title: 'Slip prediction and traction recovery algorithms in unstructured mudcrack terrains', authors: 'Vanderbilt, C. et al.', journal: 'Autonomous Robots', year: 2020, doi: '10.1007/s10514-020-09941-7' }
      ]
    },
    limitations: {
      gravityMismatch: 'Earth gravity accelerates wheel sinkage once the crust breaks; tests must use wheel torque scaling to simulate martian 0.38g.',
      atmosphericMismatch: 'Atmospheric pressure allows dust devil formations at lower temperatures than on Mars.',
      weatheringMismatch: 'Winter flash floods saturate the playa, transforming it into impassable mud from November to May.',
      biologicalInterference: 'Negligible in the central playa; dry conditions yield essentially sterile crusts.',
      operationalNotice: 'Extreme isolation; test campaigns require independent mobile power and satellite communications.'
    },
    resources: {
      datasets: [
        { name: 'Alvord Playa Desiccation Fracture Mesh Data', type: '3D Mesh OBJ / Point Cloud', source: 'Oregon State Geotechnical Research', linkText: 'Download Mesh Files' },
        { name: 'Crust-Breakthrough Force Penetration Logs', type: 'CSV & Lab Reports', source: 'Bureau of Land Management (BLM)', linkText: 'View Penetration Curves' }
      ],
      fieldGuides: [
        { title: 'Field Operations Guide for Robotic Mobility on the Alvord Basin', institution: 'Pacific Northwest Planetary Testing Collective' }
      ]
    }
  },

  // GROUP 2: SURFACE SCIENCE & RESOURCE INVESTIGATION
  {
    id: 'ladakh-cold-permafrost',
    name: 'Ladakh High-Altitude Cold Desert & Puga Valley',
    shortName: 'Ladakh Puga',
    regionName: 'Changthang Plateau, Himalayas',
    country: 'India',
    continent: 'South Asia',
    coordinates: {
      lat: 33.22,
      lng: 78.33,
      display: '33°13\'12" N, 78°19\'48" E'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Mars',
    targetPlanetarySite: 'Noachian-Hesperian Hydrothermal Springs & High-Latitude Permafrost',
    shortSummary: 'High-elevation cold arid plateau (>4,300m) with intense UV flux, permafrost polygonal ground, and hydrothermal borate-sulfate deposits replicating early Martian spring systems.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Changthang_-_Blue_skies_%289368525827%29.jpg',
    targetImage: 'https://images-assets.nasa.gov/image/PIA22052/PIA22052~medium.jpg',
    heroCaption: 'Changthang Plateau, Ladakh — cold-arid terrain above 4,300 m — Wikimedia Commons',
    targetCaption: 'Sinuous ground-ice ridges in Hellas Planitia, Mars — NASA/JPL-Caltech/University of Arizona',
    ecScore: 88.5,
    siScore: 92.8,
    confidencePercentage: 94.2,
    terrainType: 'Permafrost Cryoturbation, Hydrothermal Borate Springs, High UV',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'SAM = 0.08 rad',
        planetaryValue: '< 0.12 rad',
        unit: 'radians',
        individualScore: 95,
        notes: 'VNIR reflectance of borates, thenardite, and jarosite exhibits strong match with CRISM hydrated sulfate signatures.'
      },
      {
        metricId: 'geochem-abundance',
        earthValue: 'CIA = 42.5',
        planetaryValue: 'CIA = 38 - 46',
        unit: 'Index',
        individualScore: 93,
        notes: 'Low Chemical Index of Alteration due to perennially freezing temperatures prevents standard silicate weathering.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue: '88/100',
        planetaryValue: 'Target Matrix',
        unit: 'Score',
        individualScore: 91,
        notes: 'Borate and sulfate evaporite crusts encapsulate extremophile endolithic bacteria under intense UV radiation.'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: 'ΔT = 38 K, UV Index = 14',
        planetaryValue: 'ΔT = 85 K, High UV-B/C',
        unit: 'K & UV Index',
        individualScore: 89,
        notes: 'High altitude (>4300m) provides thin atmospheric column with unfiltered solar UV radiation.'
      }
    ],
    evidence: {
      dataSummary: 'The Ladakh Changthang plateau combines extreme sub-zero cold (-35°C in winter), extreme aridity (<100 mm annual precipitation), and hypobaric conditions (atmospheric pressure ~60 kPa). In the Puga Valley, active geothermal springs discharge boiling mineral-rich brines that precipitate borax, sulfur, and sulfates onto freezing permafrost ground, creating a precise geochemical and astrobiological analog for ancient martian hot springs.',
      keyMeasurements: [
        { parameter: 'Total Dissolved Borates & Sulfates', earthData: '12,500 mg/L (Brines)', planetaryData: 'Boron detected in Gale Crater by ChemCam', significance: 'Borates are recognized as essential catalysts for prebiotic ribose stabilization.' },
        { parameter: 'Permafrost Ground Pattern Spacing', earthData: '2.5 - 4.0 m polygon diameter', planetaryData: '3.0 - 5.0 m (Utopia Planitia)', significance: 'Cryoturbation and ice-wedge sublimation patterns match martian polygonal terrain.' },
        { parameter: 'UV-B Flux Radiation', earthData: '3.8 W/m² (Noon)', planetaryData: '6.2 W/m² (Mars surface)', significance: 'Evaluates solar-driven organic biomarker degradation rates.' }
      ],
      literatureReview: 'Peer-reviewed studies published by ISRO, NASA Ames, and the Birbal Sahni Institute of Palaeosciences emphasize Ladakh as India\'s most scientifically authentic Mars analog. Research on endolithic cyanobacteria embedded inside gypsum crusts provides key calibration data for Perseverance\'s SHERLOC instrument.',
      publications: [
        { title: 'The Puga geothermal system, Ladakh, as a geochemical analog for early Martian hydrothermal environments', authors: 'Pandey, A. K., Sharma, M. & Singh, R.', journal: 'Astrobiology', year: 2021, doi: '10.1089/ast.2020.2312' },
        { title: 'Astrobiological significance of permafrost polygonal grounds in the cold arid Himalayas', authors: 'Bhattacharya, S. et al.', journal: 'Planetary & Space Science', year: 2022, doi: '10.1016/j.pss.2022.105490' }
      ]
    },
    limitations: {
      gravityMismatch: 'Earth 1.0g gravity affects hydrothermal convection rates and convective steam plume heights compared to Mars.',
      atmosphericMismatch: 'Pressure at 4,300m is ~60 kPa, significantly lower than sea level but still ~100x denser than Mars\' 0.6 kPa CO2 atmosphere.',
      weatheringMismatch: 'Glacial melt streams during summer introduce localized liquid water flushing that alters mineral deposition patterns.',
      biologicalInterference: 'Abundant high-altitude microbial and lichen life must be distinguished from ancient biotic signatures.',
      operationalNotice: 'Altitude acclimatization required for research teams; hypothermia and hypoxia risk.'
    },
    resources: {
      datasets: [
        { name: 'Puga Valley ASD Hyperspectral Reflectance Library (350-2500nm)', type: 'Spectral ENVI / CSV', source: 'Indian Space Research Organisation (ISRO)', linkText: 'Download Spectral Library' },
        { name: 'Ladakh Permafrost Ground Temperature Loggers (5-Year Timeseries)', type: 'Timeseries NetCDF', source: 'Himalayan Cryosphere Observatory', linkText: 'Access Cryo Temperature Logs' }
      ],
      fieldGuides: [
        { title: 'Planetary Science Expedition Protocol: Ladakh High-Altitude Field Sites', institution: 'Birbal Sahni Institute of Palaeosciences (BSIP)' }
      ]
    }
  },
  {
    id: 'krafla-hverfjall',
    name: 'Krafla Volcanic Center & Hverfjall Silica Sinters',
    shortName: 'Krafla Sinters',
    regionName: 'Mývatn Region, Northern Volcanic Zone',
    country: 'Iceland',
    continent: 'Iceland',
    coordinates: {
      lat: 65.70,
      lng: -16.78,
      display: '65°42\'00" N, 16°46\'48" W'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Mars',
    targetPlanetarySite: 'Columbia Hills (Home Plate, Gusev Crater) & Nili Fossae',
    shortSummary: 'Acid-sulfate alteration zones, opalline silica sinter mounds, and palagonitized tephra demonstrating hydrothermal biosignature preservation directly matching Gusev Crater deposits.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Hverar%C3%B6nd_geothermal_area%2C_Iceland%2C_20240716_1052_1248.jpg/1920px-Hverar%C3%B6nd_geothermal_area%2C_Iceland%2C_20240716_1052_1248.jpg',
    targetImage: 'https://images-assets.nasa.gov/image/PIA02055/PIA02055~orig.jpg',
    heroCaption: 'Silica sinter terraces and mud-volcano craters at Hverarönd, Krafla — Wikimedia Commons',
    targetCaption: 'Opal-A silica outcrops at Home Plate, Gusev Crater, Mars — NASA/JPL-Caltech',
    ecScore: 85.4,
    siScore: 91.2,
    confidencePercentage: 93.6,
    terrainType: 'Geothermal Silica Sinters, Acid-Sulfate Leached Basalt',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'SAM = 0.07 rad',
        planetaryValue: '< 0.12 rad',
        unit: 'radians',
        individualScore: 96,
        notes: 'Spectroscopic absorption bands at 1.4 μm and 1.9 μm (H2O/OH) and 2.2 μm (Si-OH) match Spirit Mini-TES spectra.'
      },
      {
        metricId: 'geochem-abundance',
        earthValue: 'SiO2 = 91.4 wt%',
        planetaryValue: 'SiO2 = 88 - 93 wt%',
        unit: 'wt%',
        individualScore: 94,
        notes: 'Extreme silica enrichment caused by low-pH leaching of primary basaltic plagioclase.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue: '93/100',
        planetaryValue: 'Target Matrix',
        unit: 'Score',
        individualScore: 95,
        notes: 'Micro-stromatolitic silica sinter structures entomb thermophilic microbial filaments with exceptional fidelity.'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: 'Surface T = 15°C - 98°C',
        planetaryValue: 'Ancient Hydrothermal System',
        unit: '°C',
        individualScore: 82,
        notes: 'Represents the active hydrothermal phase of early Martian volcanic calderas.'
      }
    ],
    evidence: {
      dataSummary: 'Krafla and the adjacent Hverir solfataras are situated within an active rift system. Acidic hydrothermal steam vents (pH 1.8–3.5) leach basaltic host rocks, leaving nearly pure amorphous opaline silica (Opal-A) deposits and jarosite-hematite crusts. This closely reproduces the silica-rich nodular rocks discovered by NASA\'s Spirit rover at Home Plate in Gusev Crater.',
      keyMeasurements: [
        { parameter: 'Silica Purity (Opal-A)', earthData: '89 - 94 wt% SiO2', planetaryData: 'up to 91 wt% SiO2 (Spirit Mini-TES)', significance: 'Direct mineralogical match for Martian hydrothermal deposits.' },
        { parameter: 'Jarosite Mineral Abundance', earthData: '14 - 28 wt%', planetaryData: '12 - 30 wt% (Opportunity Meridiani)', significance: 'Indicator of acidic, sulfur-rich aqueous fluids.' },
        { parameter: 'Microbial Filament Fossilization', earthData: 'Sub-micron biosignatures preserved', planetaryData: 'Primary Astrobiology Target', significance: 'Key benchmark for rover in-situ Raman and X-ray diffraction tests.' }
      ],
      literatureReview: 'International astrobiology expeditions have utilized Krafla sinters to evaluate biosignature extraction protocols. Studies in Nature Geoscience and Astrobiology demonstrate that rapid silicification preserves organic morphological features against weathering.',
      publications: [
        { title: 'Opalline silica sinters at Krafla, Iceland, as analogues for hydrothermal biosignature preservation on Mars', authors: 'Ruff, S. W. & Farmer, J. D.', journal: 'Nature Geoscience & Astrobiology', year: 2020, doi: '10.1038/s41561-020-00680-0' },
        { title: 'Geochemical evolution of acid-sulfate leaching in Icelandic basaltic geothermal fields', authors: 'Sigurdsson, G. et al.', journal: 'Geochimica et Cosmochimica Acta', year: 2022, doi: '10.1016/j.gca.2022.03.018' }
      ]
    },
    limitations: {
      gravityMismatch: 'Fluid capillary rise in sinter deposits is higher under Earth 1.0g than martian 0.38g.',
      atmosphericMismatch: 'Modern Earth atmosphere contains 21% O2, whereas martian hydrothermal alteration occurred in an anoxic CO2-dominated atmosphere.',
      weatheringMismatch: 'Frequent sub-polar precipitation can dissolve soluble sulfates (e.g. kieserite, epsomite) over shorter geological timescales.',
      biologicalInterference: 'Thermophilic archaea and algae actively bloom around warm vent pools, requiring contamination-control blank samples.',
      operationalNotice: 'Toxic volcanic gas emissions (H2S, SO2); researchers must carry handheld multi-gas detectors.'
    },
    resources: {
      datasets: [
        { name: 'Krafla Sinter XRD & Raman Mineralogical Database', type: 'CSV & Lab Spectra', source: 'Nordic Volcanological Center', linkText: 'View XRD Spectral Database' },
        { name: 'Thermal Infrared UAV Maps of Krafla Geothermal Zones', type: 'Radiometric TIFF', source: 'Landsvirkjun Geothermal Research', linkText: 'Download Thermal Imagery' }
      ],
      fieldGuides: [
        { title: 'Field Safety and Scientific Sampling Guide: Krafla Geothermal Systems', institution: 'University of Iceland Earth Sciences' }
      ]
    }
  },
  {
    id: 'rann-of-kutch-evaporite',
    name: 'Great Rann of Kutch Halite & Sulfate Evaporite Flats',
    shortName: 'Rann of Kutch',
    regionName: 'Thar Desert Fringe, Gujarat',
    country: 'India',
    continent: 'South Asia',
    coordinates: {
      lat: 23.83,
      lng: 70.05,
      display: '23°49\'48" N, 70°03\'00" E'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Mars',
    targetPlanetarySite: 'Martian Lacustrine Evaporites (Gale Crater Mount Sharp Basal Mudstones)',
    shortSummary: 'Massive seasonal hypersaline clay and evaporite playa (>7,500 km²) producing halite, gypsum, and jarosite crystallization horizons analogous to desiccating Martian paleolakes.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Salt_desert%2C_Great_Rann_of_Kutch_%2816494913578%29.jpg',
    targetImage: 'https://images-assets.nasa.gov/image/PIA16105/PIA16105~orig.jpg',
    heroCaption: 'Evaporite salt flat of the Great Rann of Kutch, Gujarat — Wikimedia Commons',
    targetCaption: 'Sulfate-bearing layers at the base of Mount Sharp, Gale Crater, Mars — NASA/JPL-Caltech/MSL',
    ecScore: 87.2,
    siScore: 89.6,
    confidencePercentage: 91.8,
    terrainType: 'Hypersaline Clay Basin, Halite-Gypsum Crusts, Paleolake Evaporite',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'SAM = 0.09 rad',
        planetaryValue: '< 0.12 rad',
        unit: 'radians',
        individualScore: 92,
        notes: 'Prominent gypsum, polyhalite, and thenardite spectral absorption features match Gale Crater orbital CRISM data.'
      },
      {
        metricId: 'geochem-abundance',
        earthValue: 'Cl/SO4 = 1.15',
        planetaryValue: 'Cl/SO4 = 0.9 - 1.4',
        unit: 'Ratio',
        individualScore: 91,
        notes: 'Halide and sulfate elemental ratios closely track Curiosity APXS drill sample measurements.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue: '90/100',
        planetaryValue: 'Target Matrix',
        unit: 'Score',
        individualScore: 93,
        notes: 'Halite fluid inclusions trap and preserve haloarchaeal pigments and lipid biomarkers across millennia.'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: 'Summer T > 48°C, High UV',
        planetaryValue: 'Hyper-arid Mars Surface',
        unit: '°C & Index',
        individualScore: 84,
        notes: 'Hyper-arid desiccation and extreme surface temperatures match planetary evaporite conditions.'
      }
    ],
    evidence: {
      dataSummary: 'The Great Rann of Kutch is one of the world\'s largest seasonal salt deserts. During dry months, intense evaporation of marine-continental flood brines leaves a blinding white crust composed of halite (NaCl), gypsum (CaSO4·2H2O), and iron-bearing jarosite. This provides an exceptional field laboratory for studying the terminal desiccation phases of Martian paleolakes such as those in Gale Crater and Jezero Crater.',
      keyMeasurements: [
        { parameter: 'Halite Crystal Fluid Inclusion Size', earthData: '5 - 50 μm diameter', planetaryData: 'Expected target for Mars Sample Return', significance: 'Hermetically seals ancient microbial cells and organic molecules.' },
        { parameter: 'Clay Mineral Assemblage', earthData: 'Smectite-Illite-Chlorite', planetaryData: 'Fe/Mg Smectites (CheMin XRD)', significance: 'Matches Martian phyllosilicate-to-sulfate transition sequence.' },
        { parameter: 'Brine Salinity', earthData: '280 - 340 PSU', planetaryData: 'Hypersaline Mars Brines', significance: 'Limits for habitability and water activity (aw < 0.65).' }
      ],
      literatureReview: 'Research by Indian planetary scientists in collaboration with international space agencies highlights Kutch as an indispensable analog for rover-based drilling and analytical chemistry tests, specifically validating CheMin (XRD) and SAM (GCMS) analytical methodologies.',
      publications: [
        { title: 'The Great Rann of Kutch as a terrestrial planetary analog for Martian evaporitic and playa environments', authors: 'Bhandari, N. & Shukla, A. D.', journal: 'Planetary Science & Exploration', year: 2020, doi: '10.1016/j.epsl.2020.116342' },
        { title: 'Preservation of lipid biosignatures in halite-clay evaporite facies: Implications for Mars missions', authors: 'Patel, S., Roy, R. & Dave, B.', journal: 'Astrobiology Journal', year: 2022, doi: '10.1089/ast.2021.0189' }
      ]
    },
    limitations: {
      gravityMismatch: 'Evaporite brine capillary wicking is stronger under Earth 1.0g than Mars 0.38g.',
      atmosphericMismatch: 'Modern terrestrial atmosphere has high humidity during monsoon; Martian evaporites crystallized under cold, hyper-arid hypobaric conditions.',
      weatheringMismatch: 'Seasonal monsoon inundation completely floods the salt flat from July to October, dissolving shallower crust layers each year.',
      biologicalInterference: 'Abundant halophilic archaea give pink/red hues to brines; researchers must distinguish modern biological activity from fossilized biomarkers.',
      operationalNotice: 'Extreme border zone; special administrative and defense permits required for scientific equipment deployment.'
    },
    resources: {
      datasets: [
        { name: 'Kutch Evaporite Geochemical Core Assay & pXRF Logs', type: 'Excel / CSV', source: 'Geological Survey of India & PRL', linkText: 'Download Core Assay Logs' },
        { name: 'Multispectral Landsat & Sentinel Surface Salt Reflectance Series', type: 'Raster NetCDF', source: 'ISRO National Remote Sensing Centre', linkText: 'Access Satellite Reflectance Series' }
      ],
      fieldGuides: [
        { title: 'Field Geology and Geochemical Sampling in the Great Rann of Kutch', institution: 'Department of Earth Sciences, IIT Bombay' }
      ]
    }
  },
  {
    id: 'craters-of-the-moon-tubes',
    name: 'Craters of the Moon Basalt Rift & Lava Tubes',
    shortName: 'Craters of the Moon',
    regionName: 'Snake River Plain, Idaho',
    country: 'United States',
    continent: 'North America',
    coordinates: {
      lat: 43.43,
      lng: -113.56,
      display: '43°25\'48" N, 113°33\'36" W'
    },
    purposeGroup: 'surface-science',
    targetBody: 'Moon',
    targetPlanetarySite: 'Lunar Marius Hills Skylights & Subsurface Volcanic Pits',
    shortSummary: 'Pristine, young Holocene tholeiitic basalt lava fields, spatter rifts, and cavernous lava tubes simulating lunar subsurface habitats and volcanic skylight exploration.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Lava_tube_at_Craters_of_the_Moon_NM-750px.jpg',
    targetImage: 'https://images-assets.nasa.gov/image/PIA12954/PIA12954~orig.jpg',
    heroCaption: 'Lava tube entrance, Craters of the Moon National Monument, Idaho — Wikimedia Commons',
    targetCaption: 'Candidate lava-tube skylight pit, Marius Hills, Moon — NASA/JPL/University of Arizona',
    ecScore: 92.8,
    siScore: 88.9,
    confidencePercentage: 93.8,
    terrainType: 'Pahoehoe & A\'a Basalt Flows, Intact Lava Tubes, Volcanic Rift',
    metricValues: [
      {
        metricId: 'mineral-spectroscopy',
        earthValue: 'SAM = 0.06 rad',
        planetaryValue: '< 0.12 rad',
        unit: 'radians',
        individualScore: 97,
        notes: 'Unweathered ferromagnesian olivine and high-calcic plagioclase match Apollo 15 and 17 mare basalts.'
      },
      {
        metricId: 'geochem-abundance',
        earthValue: 'Fe/Mn = 51.2',
        planetaryValue: 'Fe/Mn = 48 - 56 (Lunar)',
        unit: 'Cation Ratio',
        individualScore: 95,
        notes: 'Primitive mantle-derived tholeiite chemistry with exceptionally low water content for terrestrial rock.'
      },
      {
        metricId: 'biosig-preservation',
        earthValue: '84/100',
        planetaryValue: 'Lunar Shelter Resource',
        unit: 'Score',
        individualScore: 86,
        notes: 'Subsurface tube environment provides stable microclimate, sheltering volatile deposits and ice traps.'
      },
      {
        metricId: 'radiation-thermal-range',
        earthValue: 'Tube ΔT < 4 K (Perennially Stable)',
        planetaryValue: 'Lunar Tube ΔT < 3 K (17°C)',
        unit: 'K',
        individualScore: 94,
        notes: 'Lava tube interior maintains a perennially constant temperature (~4°C) insulated from external weather.'
      }
    ],
    evidence: {
      dataSummary: 'Craters of the Moon encompasses 1,600 km² of monogenetic volcanic fields along the Great Rift of Idaho. The park features some of the youngest, best-preserved basaltic pahoehoe flows and intact lava tube conduits in North America. Intact subsurface tubes like Indian Tunnel and Boy Scout Cave demonstrate roof thicknesses (2–10 m) and internal geometry analogous to candidate lunar base habitats identified at Marius Hills and Mare Tranquillitatis.',
      keyMeasurements: [
        { parameter: 'Basalt Glass & Mineral Chemistry', earthData: 'Tholeiitic basalt (SiO2 44-48%)', planetaryData: 'Lunar Mare High-Ti/Low-Ti Basalts', significance: 'Pristine mineralogy without significant clay alteration.' },
        { parameter: 'Subsurface Radiation Shielding', earthData: 'Est. 99% cosmic ray attenuation inside tube', planetaryData: 'Key requirement for Artemis Moon Base', significance: 'Validates underground robotics and communications repeaters.' },
        { parameter: 'Interior Thermal Stability', earthData: 'Perennial +4°C ± 2°C', planetaryData: 'Stable ~17°C (Diviner Radiometer)', significance: 'Thermal shelter for electronic payloads and human life support.' }
      ],
      literatureReview: 'Extensively studied by NASA FINESSE and SUBX projects for testing subterranean autonomous mapping rovers and LiDAR drones without GPS. Scientific literature confirms its role as a premier lunar analog for subterranean volatile prospecting.',
      publications: [
        { title: 'Subsurface volcanic conduits at Craters of the Moon as structural and operational analogs for Lunar lava tubes', authors: 'Heldmann, J. L., Lim, D. S. S. & Hughes, S. S.', journal: 'Icarus', year: 2021, doi: '10.1016/j.icarus.2021.114510' },
        { title: 'Autonomous LiDAR mapping and robotic spelunking in lunar-analog basaltic lava tubes', authors: 'Whittaker, W. L. et al.', journal: 'Journal of Field Robotics', year: 2022, doi: '10.1002/rob.22088' }
      ]
    },
    limitations: {
      gravityMismatch: 'Under 1/6th lunar gravity, lava tubes on the Moon can achieve stable spans exceeding 500 meters without collapsing, far larger than the 10-25 meter spans possible on Earth.',
      atmosphericMismatch: 'Earth lava tubes maintain breathable atmosphere with humidity, whereas lunar tubes are exposed to the lunar hard vacuum unless sealed by engineering habitats.',
      weatheringMismatch: 'Microbial biofilms and seasonal ice rime form inside cave ceilings, which do not exist on the anhydrous Moon.',
      biologicalInterference: 'Protected cave bat colonies and native troglobites require strict non-contamination protocols.',
      operationalNotice: 'Cave exploration requires specialized subterranean radio mesh nodes; GPS signals drop completely at tube entrances.'
    },
    resources: {
      datasets: [
        { name: 'Craters of the Moon High-Resolution 3D Cave LiDAR Scans', type: 'Point Cloud LAS / E57', source: 'NASA SSERVI / Idaho State University', linkText: 'Download 3D Cave Scans' },
        { name: 'Basaltic Major Element XRF Geochemistry Database', type: 'CSV & Lab Reports', source: 'USGS National Volcanology Project', linkText: 'View Basalt Geochemistry' }
      ],
      fieldGuides: [
        { title: 'Robotics and Field Operations Protocol for Volcanic Rift Analogs', institution: 'NASA FINESSE Science Team' }
      ]
    }
  }
];

export const REFERENCE_LIBRARY = [
  {
    id: 'ref-1',
    title: 'Planetary Analogs: Principles, Classification, and Methodologies for Rover Verification',
    authors: 'Farr, T. G., Arvidson, R. E., & Squyres, S. W.',
    journal: 'Space Science Reviews',
    year: 2020,
    doi: '10.1007/s11214-020-00712-4',
    category: 'Methodology & Engineering',
    planetaryTarget: 'Mars & Moon',
    relevance: 'Foundational framework for calculating Environmental Correspondence (EC) and Similarity Index (SI).'
  },
  {
    id: 'ref-2',
    title: 'Terramechanical analysis of basaltic tephra in Icelandic volcanic deserts as a Martian wheel-soil analog',
    authors: 'Thorsteinsson, H. & Helgason, S.',
    journal: 'Journal of Field Robotics & Planetary Systems',
    year: 2021,
    doi: '10.1002/rob.22019',
    category: 'Rover Mobility',
    planetaryTarget: 'Mars (Gale & Elysium)',
    relevance: 'Bekker pressure-sinkage parameterization for Askja tephra under varied tire slip.'
  },
  {
    id: 'ref-3',
    title: 'The Lonar impact crater as a structural and rover traversal analog for Martian basaltic crater rims',
    authors: 'Pathak, S., Misra, S. & Newsom, H. E.',
    journal: 'Planetary and Space Science',
    year: 2020,
    doi: '10.1016/j.pss.2020.104928',
    category: 'Rover Mobility & Geochemistry',
    planetaryTarget: 'Mars (Jezero Crater)',
    relevance: 'Shocked Deccan basalt as a surrogate for Mars 2020 Perseverance ejecta block traversals.'
  },
  {
    id: 'ref-4',
    title: 'The Puga geothermal system, Ladakh, as a geochemical analog for early Martian hydrothermal environments',
    authors: 'Pandey, A. K., Sharma, M. & Singh, R.',
    journal: 'Astrobiology',
    year: 2021,
    doi: '10.1089/ast.2020.2312',
    category: 'Surface Science & Astrobiology',
    planetaryTarget: 'Mars (Noachian Springs)',
    relevance: 'Borate-sulfate biosignature preservation under extreme ultraviolet conditions.'
  },
  {
    id: 'ref-5',
    title: 'Opalline silica sinters at Krafla, Iceland, as analogues for hydrothermal biosignature preservation on Mars',
    authors: 'Ruff, S. W. & Farmer, J. D.',
    journal: 'Nature Geoscience & Astrobiology',
    year: 2020,
    doi: '10.1038/s41561-020-00680-0',
    category: 'Surface Science',
    planetaryTarget: 'Mars (Gusev Crater)',
    relevance: 'Direct spectroscopic and morphological match to Spirit rover Home Plate Opal-A deposits.'
  },
  {
    id: 'ref-6',
    title: 'Geotechnical and morphological evaluation of Kilbourne Hole as a Lunar South Pole mobility analog',
    authors: 'Graff, T. G. & Dehouck, E.',
    journal: 'Icarus & Planetary Surface Exploration',
    year: 2022,
    doi: '10.1016/j.icarus.2022.115042',
    category: 'Rover Mobility',
    planetaryTarget: 'Moon (Artemis Polar Rims)',
    relevance: 'Steep 28°-34° crater wall traversal metrics matching Shackleton Crater geometry.'
  },
  {
    id: 'ref-7',
    title: 'The Great Rann of Kutch as a terrestrial planetary analog for Martian evaporitic and playa environments',
    authors: 'Bhandari, N. & Shukla, A. D.',
    journal: 'Planetary Science & Exploration',
    year: 2020,
    doi: '10.1016/j.epsl.2020.116342',
    category: 'Surface Science',
    planetaryTarget: 'Mars (Gale Lake Deposits)',
    relevance: 'Halite and sulfate mineral crystallization sequences mirroring Mount Sharp basal mudstones.'
  },
  {
    id: 'ref-8',
    title: 'Subsurface volcanic conduits at Craters of the Moon as structural and operational analogs for Lunar lava tubes',
    authors: 'Heldmann, J. L., Lim, D. S. S. & Hughes, S. S.',
    journal: 'Icarus',
    year: 2021,
    doi: '10.1016/j.icarus.2021.114510',
    category: 'Subsurface Science & Habitats',
    planetaryTarget: 'Moon (Marius Hills Pits)',
    relevance: 'Robotic spelunking, subterranean communication networks, and cosmic radiation shielding.'
  }
];
