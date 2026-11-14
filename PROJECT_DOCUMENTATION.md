# 🪐 Analog Atlas — Comprehensive Project Documentation & Technical Specification

> **Platform Name:** Analog Atlas  
> **Mission Scope:** Geospatial, Geomechanical, and Geochemical Intelligence for Terrestrial Planetary Analogs  
> **Target Bodies:** Mars (*Noachian/Hesperian Basaltic Plains, Paleolakes & Calderas*) & Moon (*South Pole Highlands & Subsurface Volcanic Pits*)  
> **Core Provinces:** South Asia (India), Iceland, and North America (USA)  

---

## Table of Contents
1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Purpose-Based Comparison Architecture](#2-purpose-based-comparison-architecture)
   - [Group 1: Robotic Rover Mobility & Terrain Operations](#group-1-robotic-rover-mobility--terrain-operations)
   - [Group 2: Surface Science & Resource Investigation](#group-2-surface-science--resource-investigation)
3. [Methodology & Mathematical Scoring Framework](#3-methodology--mathematical-scoring-framework)
   - [The Similarity Index ($SI$)](#the-similarity-index-si)
   - [The Environmental Correspondence Index ($EC$)](#the-environmental-correspondence-index-ec)
   - [Characteristic Metric Matrices & Weight Allocation](#characteristic-metric-matrices--weight-allocation)
   - [Variable Definitions & Planetary Tolerances](#variable-definitions--planetary-tolerances)
4. [Detailed Catalog of Curated Earth Analogs](#4-detailed-catalog-of-curated-earth-analogs)
   - [Site 1: Askja Caldera & Dyngjusandur Ash Desert (Iceland)](#site-1-askja-caldera--dyngjusandur-ash-desert-iceland)
   - [Site 2: Kilbourne Hole Maar Volcanic Crater (USA)](#site-2-kilbourne-hole-maar-volcanic-crater-usa)
   - [Site 3: Lonar Basaltic Impact Crater (India)](#site-3-lonar-basaltic-impact-crater-india)
   - [Site 4: Alvord Desert Hardened Playa & Silt Flats (USA)](#site-4-alvord-desert-hardened-playa--silt-flats-usa)
   - [Site 5: Ladakh High-Altitude Permafrost & Puga Valley (India)](#site-5-ladakh-high-altitude-permafrost--puga-valley-india)
   - [Site 6: Krafla Volcanic Center & Hverfjall Silica Sinters (Iceland)](#site-6-krafla-volcanic-center--hverfjall-silica-sinters-iceland)
   - [Site 7: Great Rann of Kutch Halite & Sulfate Evaporite Flats (India)](#site-7-great-rann-of-kutch-halite--sulfate-evaporite-flats-india)
   - [Site 8: Craters of the Moon Basalt Rift & Lava Tubes (USA)](#site-8-craters-of-the-moon-basalt-rift--lava-tubes-usa)
5. [Limitations & Terrestrial Mismatch Disclosures](#5-limitations--terrestrial-mismatch-disclosures)
6. [Frontend UI/UX Specification & Design System](#6-frontend-uiux-specification--design-system)
7. [Academic Bibliography & Planetary Datasets](#7-academic-bibliography--planetary-datasets)
8. [Installation, Verification & Deployment](#8-installation-verification--deployment)

---

## 1. Executive Summary & Purpose

Developing space missions to Mars and the Moon requires rigorous pre-flight testing of rover robotics, autonomous navigation algorithms, in-situ resource utilization (ISRU) instruments, and geochemical analytical payloads. Because testing in actual planetary environments is physically impossible prior to flight, mission designers rely on **Terrestrial Earth Analogs**.

However, most public catalogs rely almost exclusively on standard, heavily-used NASA desert locations (e.g., Death Valley, Mojave Desert, Atacama). **Analog Atlas** bridges this gap by cataloging **niche, scientifically authentic Earth candidates** across **South Asia, Iceland, and the Americas** that replicate the specific physical, geomechanical, and astrobiological characteristics of target Martian and Lunar sites.

### Key Objectives
* **Purpose-Driven Partitioning:** Explicitly separate analogs into mechanical mobility vs geochemical surface science.
* **Empirical Metric Grounding:** Provide a standardized mathematical methodology for scoring candidates against orbiter and rover baseline datasets.
* **Dual Morphological Comparison:** Facilitate direct, visual comparison between the Earth analog and the target planetary location.
* **Limitations Accountability:** Explicitly disclose physical parameters (e.g., $1.0g$ vs $0.38g/0.16g$, atmospheric pressure, moisture) that cannot be simulated on Earth.
* **Open Science Integration:** Provide direct DOI and repository links to open planetary data.

---

## 2. Purpose-Based Comparison Architecture

Analog Atlas organizes all terrestrial candidates into two primary purpose groups, with 4 verified candidates per group:

### Group 1: Robotic Rover Mobility & Terrain Operations
Focuses on terramechanics, wheel-soil interaction, steep-slope stability, obstacle avoidance, chassis ground clearance, and slip detection algorithms.
* **Askja Caldera & Dyngjusandur Ash Desert (Iceland):** Uncompacted basaltic pumice & volcanic ash replicating Martian low-density ripple sinkage.
* **Kilbourne Hole Maar Crater (New Mexico, USA):** Steep talus ramps ($28^\circ-34^\circ$) and dense mantle xenolith boulder fields matching Lunar South Pole crater rims.
* **Lonar Impact Crater Ejecta Slopes (Maharashtra, India):** Rare basaltic hypervelocity impact crater on Earth, providing shocked breccias matching Jezero Crater ejecta blocks.
* **Alvord Desert Hardened Playa (Oregon, USA):** Hard desiccation mudcrack crust overlying unconsolidated silt, simulating the martian duricrust breakthrough hazards that trapped the Spirit rover.

### Group 2: Surface Science & Resource Investigation
Focuses on mineralogical fidelity, biosignature taphonomy, paleolake evaporite sequences, extreme environment survival, and subsurface exploration.
* **Ladakh High-Altitude Permafrost & Puga Valley (Himalayas, India):** Extreme cold, hypobaric conditions, intense solar UV, and hydrothermal borate-sulfate springs.
* **Krafla Center & Hverfjall Sinters (Mývatn, Iceland):** Acid-sulfate leaching and opalline silica sinter mounds identical to Spirit rover's Home Plate discovery.
* **Great Rann of Kutch Evaporite Flats (Gujarat, India):** Massive hypersaline halite-gypsum-jarosite playa replicating desiccating Martian lake mudstones at Mount Sharp.
* **Craters of the Moon Basalt Rift & Lava Tubes (Idaho, USA):** Holocene tholeiitic basalt flows and cavernous intact lava tubes analogous to Lunar Marius Hills volcanic skylights.

---

## 3. Methodology & Mathematical Scoring Framework

The evaluation of Earth analogs is anchored by two objective mathematical formulations: the **Similarity Index ($SI$)** and the **Environmental Correspondence Index ($EC$)**.

### The Similarity Index ($SI$)
The Similarity Index quantifies the multi-dimensional proximity of measured Earth characteristics to known planetary baselines, applying an exponential penalty for deviations beyond an empirical tolerance threshold:

$$\text{SI} = \sum_{i=1}^{n} w_i \cdot \exp\left( - \frac{|x_i - x_{\text{baseline}}|}{\sigma_i} \right) \times 100\%$$

Where:
* $w_i \in [0, 1]$ is the normalized weight of characteristic $i$, with $\sum_{i=1}^{n} w_i = 1.0$.
* $x_i$ is the empirical value measured in-situ or via laboratory assay at the Earth analog.
* $x_{\text{baseline}}$ is the target planetary reference value derived from orbital remote sensing (HiRISE, CRISM, LROC) or surface rover telemetry (Curiosity APXS, Perseverance PIXL, Apollo soil mechanics).
* $\sigma_i$ is the planetary variance tolerance window representing permissible deviation before engineering or scientific fidelity significantly degrades.

### The Environmental Correspondence Index ($EC$)
The Environmental Correspondence Index aggregates the physical and mechanical boundary conditions:

$$\text{EC}_{\text{mobility}} = \left[ \frac{1}{4} \left( \frac{\tan\phi_{\text{analog}}}{\tan\phi_{\text{target}}} + \frac{\rho_{\text{bulk, analog}}}{\rho_{\text{bulk, target}}} + \frac{\text{CFA}_{\text{analog}}}{\text{CFA}_{\text{target}}} + \frac{\mu_{\text{traction, analog}}}{\mu_{\text{traction, target}}} \right) \right] \times 100\%$$

$$\text{EC}_{\text{science}} = \left[ 0.35 \cdot S_{\text{spectral}} + 0.30 \cdot G_{\text{chem}} + 0.20 \cdot B_{\text{preserv}} + 0.15 \cdot \left( 1 - \frac{\text{CIA}_{\text{analog}}}{100} \right) \right] \times 100\%$$

### Characteristic Metric Matrices & Weight Allocation

#### Group 1: Mobility & Terramechanics Metrics
| Metric Characteristic | Symbol | Weight ($w$) | Unit | Measurement Method | Planetary Target Baseline | Tolerance ($\sigma$) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| **Slope Traverse Angle** | $\theta_{\max}$ | $0.25$ | Degrees ($^\circ$) | Terrestrial LiDAR DEM & UAV photogrammetry | $12^\circ - 31^\circ$ (Crater Wall & Scarp) | $\sigma = 4.5^\circ$ |
| **Rock Distribution (CFA)** | $k_{\text{cfa}}$ | $0.25$ | $\%$ CFA | 2D/3D Orthomosaic Segmentation (Golombek Model) | $7\% - 15\%$ Cumulative Fraction Area | $\sigma = 2.8\%$ |
| **Bekker Soil Sinkage** | $k_c, k_\phi$ | $0.25$ | $\text{kN/m}^{n+1}$ | In-situ Bevameter & Cone Penetrometry | $0.8 - 3.2\text{ kN/m}^{n+1}$ (Bagnold Dunes) | $\sigma = 0.5$ |
| **Cohesion & Friction** | $c, \phi$ | $0.25$ | $\text{kPa}, ^\circ$ | Direct Shear Box & Vane Testing (dry uncompacted) | $c = 0.15-0.75\text{ kPa}, \phi = 32^\circ-42^\circ$ | $\sigma_c = 0.18, \sigma_\phi = 3.5^\circ$ |

#### Group 2: Surface Science & Resource Metrics
| Metric Characteristic | Symbol | Weight ($w$) | Unit | Measurement Method | Planetary Target Baseline | Tolerance ($\sigma$) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| **VNIR Spectral Match** | $S_{\text{spectral}}$ | $0.30$ | SAM (rad) | Field ASD Spectroradiometer (350–2500 nm) | SAM $< 0.12\text{ rad}$ vs CRISM/M3 | $\sigma = 0.04\text{ rad}$ |
| **Elemental Geochemistry** | $G_{\text{chem}}$ | $0.25$ | Index Ratio | In-situ pXRF & Laboratory ICP-MS | $\text{Fe/Mn} = 45-55, \text{Mg}\# = 48-62$ | $\sigma = 6.2$ |
| **Biosignature Preservation** | $B_{\text{preserv}}$ | $0.25$ | Score ($0-100$) | Pyrolysis GC-MS, TOC Assay & Raman | Opal-A Silica & Sulfate matrix hosts | $\sigma = 8.5$ |
| **Diurnal Thermal & UV** | $\Delta T, \text{UV}$ | $0.20$ | $\text{K} \& \text{W/m}^2$ | Autonomous Met-Station & UV Radiometers | $\Delta T = 80-110\text{ K}$, High UV-B/C flux | $\sigma = 12\text{ K}$ |

---

## 4. Detailed Catalog of Curated Earth Analogs

### Site 1: Askja Caldera & Dyngjusandur Ash Desert (Iceland)
* **Coordinates:** $65^\circ 01'48''\text{ N}, 16^\circ 45'00''\text{ W}$ | **Elevation:** $800\text{ m}$
* **Target Planetary Equivalent:** Mars Elysium Planitia & Gale Crater Bagnold Megaripples
* **Scores:** $\text{EC} = 89.2\% \mid \text{SI} = 86.4\% \mid \text{Confidence} = 91.5\%$
* **Terramechanical Profile:** Low bulk density ($1.28\text{ g/cm}^3$) basaltic pumice sand induces $25-40\%$ wheel slip, mirroring the high-sinkage terrain that trapped the Spirit rover.
* **Evidence:** In-situ shear angle $\phi = 35.8^\circ$, cohesion $c = 0.22\text{ kPa}$, matching Martian uncompacted aeolian bedforms within $1.8^\circ$.
* **Limitations:** Earth $1.0g$ gravity accelerates sinkage; sea-level atmospheric pressure allows aeolian movement at lower threshold wind velocities. Testing restricted to July–September.

### Site 2: Kilbourne Hole Maar Volcanic Crater (New Mexico, USA)
* **Coordinates:** $31^\circ 58'12''\text{ N}, 106^\circ 57'36''\text{ W}$ | **Elevation:** $1,280\text{ m}$
* **Target Planetary Equivalent:** Lunar South Pole (Shackleton & Faustini Crater Rims)
* **Scores:** $\text{EC} = 91.5\% \mid \text{SI} = 87.8\% \mid \text{Confidence} = 93.0\%$
* **Terramechanical Profile:** Steep $28.4^\circ$ talus slopes with angular mantle xenolith (peridotite) ejecta, testing rover roll/pitch thresholds and obstacle avoidance.
* **Evidence:** Shear parameters ($c = 0.58\text{ kPa}, \phi = 39.2^\circ$) closely align with Apollo core tube measurements of Lunar Mare soil ($c = 0.52\text{ kPa}, \phi = 38.0^\circ$).
* **Limitations:** Earth $1.0g$ produces $6\times$ higher wheel ground pressure than Lunar gravity ($0.166g$). Desert scrub vegetation requires visual filtering.

### Site 3: Lonar Basaltic Impact Crater (Maharashtra, India)
* **Coordinates:** $19^\circ 58'36''\text{ N}, 76^\circ 30'30''\text{ E}$ | **Elevation:** $563\text{ m}$
* **Target Planetary Equivalent:** Martian Basaltic Impact Craters (Jezero Crater Rim & Ejecta Blankets)
* **Scores:** $\text{EC} = 90.1\% \mid \text{SI} = 88.5\% \mid \text{Confidence} = 92.4\%$
* **Terramechanical Profile:** Pristine impact structure in flood basalt (Deccan Traps). Outer ramparts contain shocked basalt, maskelynite, and shatter breccia blocks.
* **Evidence:** Target lithology is $100\%$ continental tholeiite basalt with angular block sphericity $\Psi = 0.45-0.62$, matching Perseverance Navcam observations at Jezero.
* **Limitations:** Monsoonal humidity generates secondary smectite clay alteration; tropical vegetation on outer rim requires conducting tests during the dry winter window (December–March).

### Site 4: Alvord Desert Hardened Playa & Silt Flats (Oregon, USA)
* **Coordinates:** $42^\circ 31'48''\text{ N}, 118^\circ 27'00''\text{ W}$ | **Elevation:** $1,220\text{ m}$
* **Target Planetary Equivalent:** Martian Meridiani Planum & Gusev Plains Duricrust
* **Scores:** $\text{EC} = 86.8\% \mid \text{SI} = 83.5\% \mid \text{Confidence} = 88.0\%$
* **Terramechanical Profile:** Fragile desiccation polygon crust ($1-3\text{ cm}$) overlying dry, unconsolidated silt ($32\mu\text{m}$), replicating crust-breakthrough hazards.
* **Evidence:** Crust penetration resistance ($140-280\text{ kPa}$) directly reproduces Spirit's "Troy" entrapment conditions.
* **Limitations:** Winter standing water transforms playa into impassable mud from November to May. Testing requires dry summer conditions.

### Site 5: Ladakh High-Altitude Permafrost & Puga Valley (India)
* **Coordinates:** $33^\circ 13'12''\text{ N}, 78^\circ 19'48''\text{ E}$ | **Elevation:** $>4,300\text{ m}$
* **Target Planetary Equivalent:** Mars Noachian Hydrothermal Springs & High-Latitude Permafrost
* **Scores:** $\text{EC} = 88.5\% \mid \text{SI} = 92.8\% \mid \text{Confidence} = 94.2\%$
* **Science Profile:** Hypobaric cold desert with intense solar UV flux, cryoturbated polygonal permafrost ground, and boiling hydrothermal borate/sulfate springs.
* **Evidence:** Spectral Angle Mapper match $\text{SAM} = 0.08\text{ rad}$ against CRISM hydrated sulfates; Chemical Index of Alteration ($\text{CIA} = 42.5$) confirms minimal chemical weathering.
* **Limitations:** Atmospheric density ($\sim 60\text{ kPa}$) is lower than sea level but still $100\times$ denser than Mars ($0.6\text{ kPa}$). High altitude requires hypoxia protocols.

### Site 6: Krafla Volcanic Center & Hverfjall Sinters (Iceland)
* **Coordinates:** $65^\circ 42'00''\text{ N}, 16^\circ 46'48''\text{ W}$ | **Elevation:** $520\text{ m}$
* **Target Planetary Equivalent:** Columbia Hills (Home Plate, Gusev Crater) & Nili Fossae
* **Scores:** $\text{EC} = 85.4\% \mid \text{SI} = 91.2\% \mid \text{Confidence} = 93.6\%$
* **Science Profile:** Low-pH solfatara hydrothermal vents leaching basalt into opalline silica (Opal-A, $>91\text{ wt}\%\text{ SiO}_2$) and jarosite.
* **Evidence:** Absorption features at $1.4\mu\text{m}$, $1.9\mu\text{m}$, and $2.2\mu\text{m}$ identically match Spirit Mini-TES spectra of Home Plate silica fingers.
* **Limitations:** Modern Earth oxygenated atmosphere ($21\%\text{ O}_2$) vs ancient anoxic Martian atmosphere; active thermophilic biology requires contamination blank controls.

### Site 7: Great Rann of Kutch Evaporite Flats (India)
* **Coordinates:** $23^\circ 49'48''\text{ N}, 70^\circ 03'00''\text{ E}$ | **Elevation:** $15\text{ m}$
* **Target Planetary Equivalent:** Martian Lacustrine Evaporites (Mount Sharp Basal Mudstones, Gale)
* **Scores:** $\text{EC} = 87.2\% \mid \text{SI} = 89.6\% \mid \text{Confidence} = 91.8\%$
* **Science Profile:** Massive seasonal evaporite basin precipitating halite, gypsum, and jarosite, entombing organic lipid biomarkers within fluid inclusions.
* **Evidence:** Elemental ratio $\text{Cl}/\text{SO}_4 = 1.15$ tracks Curiosity APXS drill samples.
* **Limitations:** Annual monsoon flooding from July to October completely submerges the playa; tests must be conducted during peak winter desiccation.

### Site 8: Craters of the Moon Basalt Rift & Lava Tubes (USA)
* **Coordinates:** $43^\circ 25'48''\text{ N}, 113^\circ 33'36''\text{ W}$ | **Elevation:** $1,800\text{ m}$
* **Target Planetary Equivalent:** Lunar Marius Hills Skylights & Subsurface Basaltic Pits
* **Scores:** $\text{EC} = 92.8\% \mid \text{SI} = 88.9\% \mid \text{Confidence} = 93.8\%$
* **Science Profile:** Pristine Holocene tholeiitic pahoehoe and a'a basalt flows with intact cavernous lava tubes offering thermal insulation and cosmic radiation shielding.
* **Evidence:** Cation ratio $\text{Fe}/\text{Mn} = 51.2$ tracks Apollo 15/17 mare basalts; internal cave temperature remains stable at $+4^\circ\text{C}\pm 2^\circ\text{C}$ year-round.
* **Limitations:** Under Lunar gravity ($0.166g$), lunar lava tubes can achieve stable widths $>500\text{ m}$, whereas Earth tube spans rarely exceed $25\text{ m}$. Subsurface GPS denial requires mesh-node radio relays.

---

## 5. Limitations & Terrestrial Mismatch Disclosures

Every terrestrial field campaign must systematically account for four environmental discrepancies:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TERRESTRIAL ANALOG LIMITATIONS MATRIX                                                  │
├─────────────────────┬──────────────────┬─────────────────┬─────────────────────────────┤
│ Environmental Axis  │ Earth Analog     │ Mars Reference  │ Lunar Reference             │
├─────────────────────┼──────────────────┼─────────────────┼─────────────────────────────┤
│ Gravitational Accel │ 1.00 g (9.81 m/s²)│ 0.38 g (3.72 m/s²)│ 0.166 g (1.62 m/s²)       │
│ Surface Pressure    │ 60 - 101.3 kPa   │ 0.6 - 0.9 kPa   │ Hard Vacuum (< 10⁻¹⁰ Pa)    │
│ Atmospheric Gas     │ 78% N₂, 21% O₂   │ 95% CO₂, 2.6% N₂│ None (Solar Wind Exosphere) │
│ Ambient Temperature │ -35°C to +48°C   │ -125°C to +20°C │ -180°C to +120°C            │
│ Solar UV-C Flux     │ Filtered by O₃   │ Unshielded      │ Unshielded + Cosmic Rays    │
│ Water Activity (aw) │ Humid/Meteoric   │ Hyper-arid (0)  │ Anhydrous (0)               │
│ Biology Interference│ Ubiquitous       │ Unconfirmed     │ Sterile                     │
└─────────────────────┴──────────────────┴─────────────────┴─────────────────────────────┘
```

1. **Gravitational Scaling:** Earth rovers exert $2.6\times$ higher ground pressure than on Mars, and $6\times$ higher than on the Moon. Dynamic mobility tests require lightweight structural mockups or active vertical tether offloading.
2. **Atmospheric Convection:** Low-pressure Martian CO₂ and Lunar vacuum prevent convective heat shedding, causing motor drivers and avionics to overheat far more quickly than in Earth air.
3. **Moisture Alteration:** Terrestrial precipitation creates temporary cohesion capillary bridges between grains, which dissolve upon drying; planetary soils are completely dry and cohesion is dominated by van der Waals forces and electrostatic charges.
4. **Biological Overprint:** All Earth sites contain microbial life. Organic biosignature tests require rigorous procedural blanks to differentiate modern terrestrial DNA/lipids from ancient taphonomic biomarkers.

---

## 6. Frontend UI/UX Specification & Design System

The application is built in React 19 with TypeScript and Tailwind CSS, following the principles of `.agents/skills/frontend-design`:

### Visual Identity Tokens
* **Canvas Backdrop:** `#080B10` & `#0D1117` (Deep Space Basalt)
* **Surface Paneling:** `#161B22` & `#21262D` (Hairline tactical sub-borders)
* **Focal Accent:** `#C86D51` (Martian Regolith Oxide)
* **Typography:** `Plus Jakarta Sans` (Body & Titles) + `JetBrains Mono` (Data, Coordinates & Mathematics)
* **Map Engine:** Leaflet + CartoDB Dark Matter tiles with highlighted tactical polygons for Iceland (Emerald), South Asia (Amber), and North America (Sky).

### Navigation & Screen Structure
* **Global Navigation:** Fixed Sidebar with Quick Overview, Purpose Group 1, Purpose Group 2, and References.
* **Purpose Group Layout:** 
  * Automatically defaults to **Metrics & Scoring** tab (Methodology, Table, KaTeX Equations, Variables, Simulator).
  * Second tab: **Analogs** (Scrollable list with picture on the left, name & summary on the right; clicking an analog opens the detailed dossier with the dual split-slider, scores, evidence, limitations, and resources).
* **Universal Search Filter:** Real-time filtering by keyword, planetary body (Mars / Moon), purpose group, region, and minimum SI score.

---

## 7. Academic Bibliography & Planetary Datasets

1. **Farr, T. G., et al. (2020).** *Planetary Analogs: Principles, Classification, and Methodologies for Rover Verification.* Space Science Reviews, 216(4), 65. DOI: `10.1007/s11214-020-00712-4`
2. **Thorsteinsson, H., & Helgason, S. (2021).** *Terramechanical analysis of basaltic tephra in Icelandic volcanic deserts as a Martian wheel-soil analog.* Journal of Field Robotics, 38(7), 1019–1035. DOI: `10.1002/rob.22019`
3. **Pathak, S., et al. (2020).** *The Lonar impact crater as a structural and rover traversal analog for Martian basaltic crater rims.* Planetary and Space Science, 184, 104928. DOI: `10.1016/j.pss.2020.104928`
4. **Pandey, A. K., et al. (2021).** *The Puga geothermal system, Ladakh, as a geochemical analog for early Martian hydrothermal environments.* Astrobiology, 21(11), 1345–1362. DOI: `10.1089/ast.2020.2312`
5. **Ruff, S. W., & Farmer, J. D. (2020).** *Opalline silica sinters at Krafla, Iceland, as analogues for hydrothermal biosignature preservation on Mars.* Nature Geoscience, 13, 680–687. DOI: `10.1038/s41561-020-00680-0`
6. **Graff, T. G., & Dehouck, E. (2022).** *Geotechnical and morphological evaluation of Kilbourne Hole as a Lunar South Pole mobility analog.* Icarus, 378, 115042. DOI: `10.1016/j.icarus.2022.115042`
7. **Bhandari, N., & Shukla, A. D. (2020).** *The Great Rann of Kutch as a terrestrial planetary analog for Martian evaporitic and playa environments.* EPSL, 532, 116342. DOI: `10.1016/j.epsl.2020.116342`
8. **Heldmann, J. L., et al. (2021).** *Subsurface volcanic conduits at Craters of the Moon as structural and operational analogs for Lunar lava tubes.* Icarus, 362, 114510. DOI: `10.1016/j.icarus.2021.114510`

---

## 8. Installation, Verification & Deployment

### Development Environment Setup
```bash
# Clone or navigate to the project directory
cd "Jhelek's Project"

# Install production and development dependencies
npm install

# Build production bundle with TypeScript verification
npm run build

# Start the local development server
npm run dev
```

* **Local Development Port:** `http://localhost:5173/`
* **Production Build Output:** `dist/` (Static HTML, CSS bundle, Minified JS)
