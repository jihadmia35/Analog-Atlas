# 🪐 Analog Atlas — Comprehensive Project Documentation & Technical Specification

> **Platform Name:** Analog Atlas  
> **Mission Scope:** Geospatial, Geomechanical, and Geochemical Intelligence for Terrestrial Planetary Analogs  
> **Target Bodies:** Mars (*Nili Fossae, Utopia & Chryse Planitiae, mid-latitude ice*) & Moon (*highlands crust & regolith*)  
> **Core Provinces:** Antarctica, South Asia (India & Pakistan), East Asia (China & Japan), South America (Argentina)  
> **Data Sources:** *Final Analog Data for Surface Science* (surface-science dossiers, Figures 1–8, scores) · *Characteristic metric matrix* — `Nasa Proj.docx` (mobility matrix, scoring rule, site profiles, mobility figures) and its PDF export (piecewise score rule, slope derivations, calculation summary)

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
   - [Site 1: Qaidam Basin, China (Mars — Nili Fossae ridges)](#site-1-qaidam-basin-china-mars--nili-fossae-ridges)
   - [Site 2: Puna, Argentina (Mars — transverse aeolian ridges)](#site-2-puna-argentina-mars--transverse-aeolian-ridges)
   - [Site 3: Chandragup I, Pakistan (Mars — Utopia Planitia cones)](#site-3-chandragup-i-pakistan-mars--utopia-planitia-cones)
   - [Site 4: Baratang Mud Volcano Field, India (Mars — pitted cones)](#site-4-baratang-mud-volcano-field-india-mars--pitted-cones)
   - [Site 5: Beacon Valley, Antarctica (Mars — mid-latitude ice)](#site-5-beacon-valley-antarctica-mars--mid-latitude-ice)
   - [Site 6: Miyake-jima, Japan (Moon — highlands crust)](#site-6-miyake-jima-japan-moon--highlands-crust)
   - [Site 7: Sittampundi Anorthosite Complex, India (Moon — highlands regolith)](#site-7-sittampundi-anorthosite-complex-india-moon--highlands-regolith)
   - [Site 8: Lonar Crater, India (Mars — basaltic craters)](#site-8-lonar-crater-india-mars--basaltic-craters)
5. [Limitations & Terrestrial Mismatch Disclosures](#5-limitations--terrestrial-mismatch-disclosures)
6. [Frontend UI/UX Specification & Design System](#6-frontend-uiux-specification--design-system)
7. [Academic Bibliography & Planetary Datasets](#7-academic-bibliography--planetary-datasets)
8. [Installation, Verification & Deployment](#8-installation-verification--deployment)

---

## 1. Executive Summary & Purpose

Developing space missions to Mars and the Moon requires rigorous pre-flight testing of rover robotics, autonomous navigation algorithms, in-situ resource utilization (ISRU) instruments, and geochemical analytical payloads. Because testing in actual planetary environments is physically impossible prior to flight, mission designers rely on **Terrestrial Earth Analogs**.

However, most public catalogs rely almost exclusively on standard, heavily-used NASA desert locations (e.g., Death Valley, Mojave Desert, Atacama). **Analog Atlas** bridges this gap by cataloging **niche, scientifically authentic Earth candidates** across **Antarctica, South Asia, East Asia and South America** that replicate the specific physical, geomechanical, and astrobiological characteristics of target Martian and Lunar sites. Every published reading, score, figure and citation in the catalog is taken directly from the supplied source dossiers rather than estimated.

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
Focuses on terramechanics, wheel-soil interaction, steep-slope stability, obstacle avoidance, chassis ground clearance, and slip detection algorithms. Source: *Characteristic metric matrix* (`Nasa Proj.docx` and its PDF export).
* **Qaidam Basin, China:** Yardangs and ridge complexes for ridge navigation and obstacle mapping against Nili Fossae; the only site with supplied geometry (SI 62.5, EC 12.5).
* **Puna, Argentina:** Gravel megaripples and yardangs standing in for transverse aeolian ridges of Utopia and Oxia Planum (SI 50.0, EC 0).
* **Chandragup I, Pakistan:** Mud-volcano cones for cone mapping and terrain navigation against Utopia Planitia (SI 50.0, EC 0).
* **Baratang Mud Volcano Field, India:** Irregular mud-volcano terrain for mapping pitted cones of Chryse and Acidalia Planitiae (SI 50.0, EC 0).

### Group 2: Surface Science & Resource Investigation
Focuses on mineralogical fidelity, biosignature taphonomy, evaporite geochemistry, extreme environment survival, and subsurface exploration. Source: *Final Analog Data for Surface Science*.
* **Beacon Valley, Antarctica:** Massive ground ice beneath a sublimation residue — the reference analog for Martian mid-latitude ice (SI 50.0, EC 0).
* **Miyake-jima, Japan:** High-calcic plagioclase and ferroan anorthosite for lunar highland crust (SI 57.5, EC 15).
* **Sittampundi Anorthosite Complex, India:** Highland anorthosite and regolith engineering — source of the LSS-ISAC-1 lunar simulant (SI 50.0, EC 15).
* **Lonar Crater, India:** Basaltic impact crater with post-impact hydrothermal alteration for Martian basaltic craters (SI 50.0, EC 15).

---

## 3. Methodology & Mathematical Scoring Framework

The evaluation of Earth analogs is anchored by two objective mathematical formulations: the **Similarity Index ($SI$)** and the **Environmental Correspondence Index ($EC$)**.

### The Similarity Index ($SI$)
The Similarity Index quantifies the multi-dimensional proximity of measured Earth characteristics to known planetary baselines. A reading inside the baseline range scores the characteristic in full; a reading outside decays linearly over two tolerances; a characteristic with no site data stays neutral:

$$
s_i = \begin{cases} 1 & x_i \in [x_{\min}, x_{\max}] \\[2pt] \max\!\left(0,\; 1 - \frac{d_i}{2\sigma_i}\right) & \text{outside the baseline range} \\[2pt] 0.5 & \text{no site data} \end{cases}
$$

$$
SI = 100 \sum_{i=1}^{4} w_i\, s_i
$$

Where:
* $w_i \in [0, 1]$ is the normalized weight of characteristic $i$, with $\sum_{i=1}^{n} w_i = 1.0$ (0.25 each in the mobility matrix).
* $x_i$ is the empirical value measured in-situ or via laboratory assay at the Earth analog.
* $d_i$ is the distance from the site value to the nearest baseline bound.
* $\sigma_i$ is the planetary variance tolerance window representing permissible deviation before engineering or scientific fidelity significantly degrades. The 2σ decay gives $s = 0.50$ at one tolerance outside the range and 0 at two.

### The Environmental Correspondence Index ($EC$)
The Environmental Correspondence Index weights the evidence behind each characteristic rather than the physical boundary conditions:

$$
EC = 100 \sum_{i=1}^{4} w_i\, q_i
$$

Where $q_i$ is the evidence weight: 1 for a measured value, 0.5 for a value derived from other supplied data, and 0 where no data exists. Site scores therefore distinguish a well-characterised analog from an unmeasured candidate.

### Characteristic Metric Matrices & Weight Allocation

#### Group 1: Mobility & Terramechanics Metrics
| Metric Characteristic | Symbol | Weight ($w$) | Unit | Measurement Method | Planetary Target Baseline | Tolerance ($\sigma$) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| **Slope Traverse Angle** | $\theta_{\max}$ | $0.25$ | Degrees ($^\circ$) | Terrestrial LiDAR DEM & UAV photogrammetry | $12^\circ - 31^\circ$ (Jezero Delta Scarp / Lunar South Pole Crater Slopes) | $\sigma = 4.5^\circ$ |
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

Slope angles for the mobility sites are mean flank angles derived from the supplied heights and widths, not DEM-measured slopes:

$$
\theta_{ridge} = \arctan\!\left(\frac{h}{w}\right) \qquad \theta_{cone} = \arctan\!\left(\frac{2h}{w}\right)
$$

### Calculation Summary (Mobility Group)

Only Qaidam moves off the neutral score, because the supplied file gives geometry for one of the four characteristics at one site. Rock CFA, Bekker and cohesion/friction need new measurements at all four sites.

| Site | Slope $s$ | CFA $s$ | Bekker $s$ | $c, \phi$ $s$ | SI (4-metric) | EC (4-metric) | SI in source file (6-metric) | EC in source file (6-metric) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Qaidam Basin | 1.00 | 0.50 | 0.50 | 0.50 | 62.5 | 12.5% | 67.6 | 77.5% |
| Puna | 0.50 | 0.50 | 0.50 | 0.50 | 50.0 | 0% | 61.3 | 60% |
| Chandragup I | 0.50 | 0.50 | 0.50 | 0.50 | 50.0 | 0% | 57.5 | 30% |
| Baratang | 0.50 | 0.50 | 0.50 | 0.50 | 50.0 | 0% | 43.8 | 47.5% |

---

## 4. Detailed Catalog of Curated Earth Analogs

### Site 1: Qaidam Basin, China (Mars — Nili Fossae ridges)
* **Coordinates:** $36^\circ 00'\text{ N}, 94^\circ 00'\text{ E}$ | **Province:** Qinghai
* **Target Planetary Equivalent:** Nili Fossae ridge systems, Mars
* **Scores:** $\text{SI} = 62.5\% \mid \text{EC} = 12.5\%$
* **Mobility Profile:** Large ridge $4.70\text{ m}$ high $\times 11.80\text{ m}$ wide gives a derived flank angle of $21.7^\circ$ (small ridge $0.80\text{ m} \times 4.00\text{ m} \rightarrow 11.3^\circ$). The Nili Fossae large ridge is $4.00\text{ m} \times 13.40\text{ m} \rightarrow 16.6^\circ$. The Earth large ridge sits inside the $12^\circ - 31^\circ$ baseline: $s = 1.00$, $q = 0.5$.
* **Evidence:** Gypsum content up to $96\%$ is reported; the Mars terrain model has $0.25\text{ m/pixel}$ resolution; named operations are rover navigation, 3D terrain mapping, Raman/LIBS analysis, XRD mineral identification and shallow drilling.
* **Limitations:** Slopes are derived from height and width, so a uniform ridge profile is assumed; Earth ridge intersection angles are not yet measured; terrain-model resolution still needs extraction; Martian gypsum is not definitively confirmed.

### Site 2: Puna, Argentina (Mars — transverse aeolian ridges)
* **Coordinates:** $25^\circ 00'\text{ S}, 67^\circ 00'\text{ W}$ | **Province:** Puna de Atacama, Catamarca
* **Target Planetary Equivalent:** Utopia Planitia / Oxia Planum, Mars
* **Scores:** $\text{SI} = 50.0\% \mid \text{EC} = 0\%$
* **Mobility Profile:** Bedform height was not retrieved and heights and widths are not paired, so no flank angle can be derived ($s = 0.50$, $q = 0$). Gravel-armoured deposits give a qualitative rock-frequency reading only; wheel–gravel interaction and slip are the named mission tests, but no Bekker $k$ values exist.
* **Evidence:** Named operations are rover mobility testing, wheel–gravel interaction, bedform crossing, autonomous terrain mapping and slip investigation; rover crossing thresholds of $15\text{ cm}$ or $25\text{ cm}$ crests are considered cases.
* **Limitations:** Megaripple height and wavelength must still be measured; the crossing thresholds are not a confirmed universal rover limit; rainfall (under $300\text{ mm/yr}$) and elevation (about $4,000\text{ m}$) are not directly comparable with Mars.

### Site 3: Chandragup I, Pakistan (Mars — Utopia Planitia cones)
* **Coordinates:** $25^\circ 24'\text{ N}, 66^\circ 36'\text{ E}$ | **Province:** Chandragup Hills, Sindh
* **Target Planetary Equivalent:** Utopia Planitia cones, Mars
* **Scores:** $\text{SI} = 50.0\% \mid \text{EC} = 0\%$
* **Mobility Profile:** The cone is about $90\text{ m}$ high but no base width is established, so no Earth flank angle can be derived. Martian cones are $10 - 100\text{ m}$ high on $200 - 1,100\text{ m}$ bases, giving $5.7^\circ - 10.3^\circ$, at or below the low edge of the baseline. Mud and fluid deposits are present but no Bekker $k$ values were measured.
* **Evidence:** Named operations are rover cone mapping, cone-height measurement, remote gas sensing, sediment sampling, subsurface radar and autonomous terrain classification; methane-rich fluids are reported regionally.
* **Limitations:** The $90\text{ m}$ cone height needs primary-source verification; base width, surface temperature and pH are not established; the gas report is regional, not site-specific; the Martian height and width ranges are unpaired, so $5.7^\circ$ and $10.3^\circ$ are illustrative cases.

### Site 4: Baratang Mud Volcano Field, India (Mars — pitted cones)
* **Coordinates:** $12^\circ 03'\text{ N}, 92^\circ 39'\text{ E}$ | **Province:** Baratang Island, Andaman & Nicobar
* **Target Planetary Equivalent:** Chryse and Acidalia Planitiae, Mars
* **Scores:** $\text{SI} = 50.0\% \mid \text{EC} = 0\%$
* **Mobility Profile:** The central mound is about $2\text{ m}$ high but its width is not supplied, so no angle can be derived. Mud, water, sandstone and shale make the surface soft and wet — sinkage is likely high — but nothing is measured, so the characteristic stays neutral ($s = 0.50$, $q = 0$).
* **Evidence:** Named operations are robotic cone mapping, remote gas detection, sediment sampling, terrain classification and autonomous navigation around irregular landforms; surface temperature is $29.39 - 30.07\,^\circ\text{C}$ at pH $8.0 - 8.3$.
* **Limitations:** Site-specific Martian central-mound measurements were not extracted; Mars has no equivalent active-vent temperature or surface-fluid pH measurement; ancient Martian fluid and gas activity is an interpretation, not a direct measurement.

### Site 5: Beacon Valley, Antarctica (Mars — mid-latitude ice)
* **Coordinates:** $77^\circ 49'\text{ S}, 160^\circ 39'\text{ E}$ | **Province:** McMurdo Dry Valleys, Victoria Land
* **Target Planetary Equivalent:** Mars mid-latitude ice deposits
* **Scores:** $\text{SI} = 50.0\% \mid \text{EC} = 0\%$
* **Science Profile:** Massive ground ice lies beneath approximately $30 - 50\text{ cm}$ of sublimation till, with roughly $10\text{ wt}\%$ mineral debris and perchlorate at approximately $0.4 - 0.6\text{ wt}\%$ in soil. The planetary references are Dodo-Goldilocks ice ($>99\text{ wt}\%$ ice) and Snow White material ($30 \pm 20\text{ wt}\%$ ice).
* **Evidence:** Ground-penetrating radar and seismic surveys found $80 - 110\text{ m}$ of ice in upper Mullins Valley and $150\text{ m}$ in upper Beacon Valley; mean annual temperature is about $-22.9\,^\circ\text{C}$ with a decade of records down to $19.6\text{ m}$; soil organic carbon is $13.1 \pm 2.9\,\mu\text{mol C/g}$ (surface soil, 0–10 cm).
* **Limitations:** A denser Earth atmosphere changes sublimation and exposed-ice behaviour; Earth gravity is not representative of Mars; Beacon Valley ice and debris cannot be assumed to match every Martian excess-ice deposit; cold is not equivalent to the Martian surface cycle; central-site and upper-valley measurements are not interchangeable.

### Site 6: Miyake-jima, Japan (Moon — highlands crust)
* **Coordinates:** $34^\circ 05'\text{ N}, 139^\circ 32'\text{ E}$ | **Province:** Izu Islands, Tokyo Metropolis
* **Target Planetary Equivalent:** Lunar highlands crust
* **Scores:** $\text{SI} = 57.5\% \mid \text{EC} = 15\%$
* **Science Profile:** Near-uniform high-calcic anorthite megacrysts ($\text{An}_{95.51} \pm 0.31$) with an NIR feature near $1.25\,\mu\text{m}$ and TIR crystal-field features at $1233.9$ and $1275.6\text{ cm}^{-1}$, against a highly calcic lunar benchmark ($\text{An}_{94-98}$). Seven analysed grains give mean Li $0.31\text{ ppm}$, K $44.01\text{ ppm}$, Na $3{,}510\text{ ppm}$ and Ti $37.29\text{ ppm}$.
* **Evidence:** The crystals are xenocrysts entrained by island-arc magma; pulverised crystals are used as an experimental starting material for lunar crustal suites.
* **Limitations:** The crystals sit in basaltic flows, not an anorthositic crustal outcrop; no lunar regolith, impact glass, agglutinates or solar-wind implantation is present; humid terrestrial alteration does not operate on the airless Moon; Earth lacks lunar vacuum, radiation and thermal swing; seven grains cannot represent the island.

### Site 7: Sittampundi Anorthosite Complex, India (Moon — highlands regolith)
* **Coordinates:** $11^\circ 01'\text{ N}, 78^\circ 01'\text{ E}$ | **Province:** Namakkal district, Tamil Nadu
* **Target Planetary Equivalent:** Lunar highlands regolith
* **Scores:** $\text{SI} = 50.0\% \mid \text{EC} = 15\%$
* **Science Profile:** Plagioclase $\text{An}_{80-100}$ ($\text{An}_{99-100}$ in chromite-hosting anorthosite) against a lunar highland benchmark of about $\text{An}_{95}$. The LSS-ISAC-1 simulant analyses SiO$_2$ $43.61 - 46.60\%$, Al$_2$O$_3$ $29.85 - 31.77\%$ and CaO $16.28 - 16.96\%$, against lunar $45.16\%$, $27.66\%$ and $15.63\%$.
* **Evidence:** The complex is the source of the LSS-ISAC-1 simulant used at ISRO's Lunar Terrain Testing Facility in Bengaluru for Chandrayaan-2 soft landing and rover mobility; it is Neoarchean with a minimum emplacement age of $2522 \pm 12\text{ Ma}$.
* **Limitations:** Natural anorthosite lacks impact glass, agglutinates and space-weathered grains; anorthosite, gabbro, chromitite and pyroxenite must not be treated as one material; retrogression and terrestrial alteration can lower An content; simulant properties do not transfer to every outcrop; the Chandrayaan-2 tests ran at Bengaluru, not at the complex.

### Site 8: Lonar Crater, India (Mars — basaltic craters)
* **Coordinates:** $19^\circ 58'\text{ N}, 76^\circ 31'\text{ E}$ | **Province:** Buldhana district, Maharashtra
* **Target Planetary Equivalent:** Martian basaltic craters
* **Scores:** $\text{SI} = 50.0\% \mid \text{EC} = 15\%$
* **Science Profile:** Saponite with minor celadonite and carbonate matches saponite identified on Mars. Shocked impact melt analyses SiO$_2$ $49.33 - 50.69\%$, FeO $8.64 - 8.77\%$ and MgO $5.03 - 5.10\%$, giving Mg# $0.399 - 0.402$, against Martian $45 - 50\%$, $15 - 20\%$ and $5 - 10\%$.
* **Evidence:** A $1.8\text{ km}$ crater in Deccan basalt with drilled floor cores of basaltic impact breccia altered by post-impact hydrothermal processes; alteration temperatures are modelled at $130 - 200\,^\circ\text{C}$; the crater age is reported as $50{,}000$ yr, $37.5 \pm 5.0\text{ ka}$ and $570 \pm 47\text{ ka}$ in different studies.
* **Limitations:** Mars comparisons must be restricted to similar crater size classes or to mineralogical and process analogies; terrestrial fluid chemistry, duration and temperature may differ from Mars; the modern lake chemistry is not the ancient hydrothermal system; published ages disagree by more than an order of magnitude; no quantitative mineral-abundance comparison exists yet.

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
* **Canvas Backdrop:** `#0A0D12` ink (dark) / `#EC EFF2` neutral plate (day)
* **Surface Paneling:** layered panels — hairline rule, lit top edge, soft ambient lift (`--panel-shadow`)
* **Focal Accent:** `#CB7052` Martian regolith oxide
* **Typography:** `Instrument Sans` (body & display, tight tracking) + `IBM Plex Mono` (data, coordinates, tabular figures)
* **Instrument Scale:** every score is rendered as a segmented rule — a muted fill with a bright leading segment marking the value inside its range
* **Map Engine:** Leaflet + Esri World Topo tiles, inverted to a night reference map, overlaid with a graticule and vignette; highlighted tactical polygons for East Asia (Azure), South Asia (Amber), South America (Emerald) and Antarctica (Grey).

### Navigation & Screen Structure
* **Global Navigation:** Fixed Sidebar with Atlas overview, Purpose Group 1, Purpose Group 2 and References, followed by a grouped site index (mobility / surface science) carrying each analog's SI.
* **Home:** editorial masthead on a gridded plate with a hairline stat strip (analogs listed, source provinces, target bodies, SI range), the world map, the two purpose groups as panels with mean-SI read-outs, and the candidate index.
* **Purpose Group Layout:** 
  * Automatically defaults to **Metrics & Scoring** tab (Methodology, Equations, Characteristic metric matrix, Calculation summary, Variables, Simulator).
  * Second tab: **Analogs** (cards with the site photograph, name & summary; clicking an analog opens the detailed dossier with the dual split-slider, score read-outs, evidence, mismatch disclosures and resources).
* **Universal Search Filter:** Real-time filtering by keyword, planetary body (Mars / Moon), purpose group, region, and minimum SI score.

---

## 7. Academic Bibliography & Planetary Datasets

1. **Liu, Sletten, Hallet & Waddington (2018).** *JGR Earth Surface* 123(8), 1797–1810. — Beacon Valley ground ice and ice thickness.
2. **Shean & Marchant (2010).** *J. Glaciology* 56(195), 48–64. — Mullins-sector till lithology.
3. **Barrett et al. (2007).** *Biogeochemical Stoichiometry of Antarctic Dry Valley Ecosystems.* — Beacon Valley soil organic carbon.
4. **Bramson et al. (2015).** *Widespread Excess Ice in Arcadia Planitia, Mars.*
5. **Stuurman et al. (2016).** *SHARAD Detection and Characterization of Subsurface Water Ice Deposits in Utopia Planitia.*
6. **Roy, Mallik, Donaldson Hanna, Goepfert & Hervig (2025).** *American Mineralogist* 110, 154–170. — Miyake-jima anorthite megacrysts.
7. **Anbazhagan et al. (2021).** *Icarus* 366, 114511. — Sittampundi as the source of LSS-ISAC-1.
8. **Venugopal et al. (2020).** *Planet. Space Sci.* 194, 105116, and *Adv. Space Res.* 66(11), 2711–2721. — Major-oxide characterisation of the simulant.
9. **Subramaniam (1956).** *GSA Bulletin* 67(3), 317–390. — Geological description of the Sittampundi complex.
10. **Dutta et al. (2011).** *Ore Geology Reviews.* — Chromitite and pyroxenite phases.
11. **Hagerty & Newsom (2003).** *Meteoritics & Planetary Science* 38(3), 365–381. — Hydrothermal alteration at Lonar.
12. **Jourdan, Moynier, Koeberl & Eroglu (2011).** *Geology* 39(7), 671–674. — 40Ar/39Ar crater age for Lonar.
13. **Nakamura et al. (2014).** *Geochemistry, Geophysics, Geosystems.* DOI: `10.1002/2014GC005376` — Shock-metamorphosed impact melt chemistry.
14. **Paul et al. (2016).** *Exploration of Microbial Diversity and Community Structure of Lonar Lake.*

**Planetary datasets referenced by the dossiers:** NASA PDS SHARAD archive · NASA PDS Moon Mineralogy Mapper archive · NASA PDS LRO data · NASA PDS CRISM archive · NASA PDS HiRISE archive · Supplementary data, University of Arizona figshare.

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
