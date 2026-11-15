import React from 'react';
import { REFERENCE_LIBRARY } from '../../data/analogsData';
import { ExternalLink } from 'lucide-react';

const LIMITATIONS_MATRIX: Array<{
  axis: string;
  earth: string;
  mars: string;
  moon: string;
}> = [
  {
    axis: 'Gravitational acceleration',
    earth: '1.00 g (9.81 m/s²)',
    mars: '0.38 g (3.72 m/s²)',
    moon: '0.166 g (1.62 m/s²)',
  },
  {
    axis: 'Surface pressure',
    earth: '60 – 101.3 kPa',
    mars: '0.6 – 0.9 kPa',
    moon: 'Hard vacuum (< 10⁻¹⁰ Pa)',
  },
  {
    axis: 'Atmospheric gas',
    earth: '78% N₂, 21% O₂',
    mars: '95% CO₂, 2.6% N₂',
    moon: 'None — solar-wind exosphere',
  },
  {
    axis: 'Ambient temperature',
    earth: '−35°C to +48°C',
    mars: '−125°C to +20°C',
    moon: '−180°C to +120°C',
  },
  {
    axis: 'Solar UV-C flux',
    earth: 'Filtered by ozone layer',
    mars: 'Unshielded',
    moon: 'Unshielded + cosmic rays',
  },
  {
    axis: 'Water activity (a_w)',
    earth: 'Humid / meteoric',
    mars: 'Hyper-arid (≈ 0)',
    moon: 'Anhydrous (≈ 0)',
  },
  {
    axis: 'Biology interference',
    earth: 'Ubiquitous',
    mars: 'Unconfirmed',
    moon: 'Sterile',
  },
];

const SCALING_NOTES = [
  {
    title: 'Gravity scaling',
    text: 'Earth rovers exert 2.6× higher ground pressure than on Mars, and 6× higher than on the Moon. Dynamic mobility tests require lightweight structural mockups or active vertical-tether offloading.',
  },
  {
    title: 'Atmospheric convection',
    text: 'Low-pressure Martian CO₂ and the Lunar vacuum prevent convective heat shedding, so motor drivers and avionics overheat far faster there than in Earth air.',
  },
  {
    title: 'Moisture alteration',
    text: 'Terrestrial precipitation creates temporary capillary bridges between grains that dissolve on drying; planetary soils are completely dry, with cohesion dominated by van der Waals forces and electrostatic charge.',
  },
  {
    title: 'Biological overprint',
    text: 'Every Earth site hosts microbial life. Biosignature tests require rigorous procedural blanks to separate modern terrestrial DNA and lipids from ancient taphonomic markers.',
  },
];

export const ResourcesPage: React.FC = () => {
  return (
    <div className="max-w-[1100px] animate-rise">
      <header className="pb-6 border-b border-line">
        <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-ink">
          References &amp; methodology notes
        </h1>
        <p className="mt-2 text-[14.5px] text-ink-2 max-w-[72ch] leading-relaxed">
          Every score in the atlas traces back to peer-reviewed work and open planetary datasets.
          Start with the limitations below, then the bibliography.
        </p>
      </header>

      {/* Terrestrial mismatch matrix */}
      <section className="py-8">
        <h2 className="text-[17px] font-bold text-ink mb-1">Terrestrial analog limitations matrix</h2>
        <p className="text-[13px] text-ink-2 mb-5 max-w-[70ch]">
          Four environmental axes can never be closed on Earth. The matrix states each one
          quantitatively for both target bodies.
        </p>
        <div className="border border-line rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-surface font-mono text-[10.5px] tracking-wide text-ink-3">
                <th className="px-4 py-3 font-medium">Environmental axis</th>
                <th className="px-3 py-3 font-medium">Earth analog</th>
                <th className="px-3 py-3 font-medium">Mars reference</th>
                <th className="px-3 py-3 font-medium">Lunar reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {LIMITATIONS_MATRIX.map((row) => (
                <tr key={row.axis} className="hover:bg-hover transition-colors">
                  <td className="px-4 py-3 text-[13px] text-ink font-medium">{row.axis}</td>
                  <td className="px-3 py-3 font-mono text-[12px] text-ink-2">{row.earth}</td>
                  <td className="px-3 py-3 font-mono text-[12px] text-mars">{row.mars}</td>
                  <td className="px-3 py-3 font-mono text-[12px] text-moon">{row.moon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scaling notes */}
      <section className="pb-8">
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
          {SCALING_NOTES.map((n) => (
            <div key={n.title}>
              <h3 className="text-[13.5px] font-semibold text-ink">{n.title}</h3>
              <p className="mt-1 text-[12.5px] text-ink-2 leading-relaxed">{n.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Imagery attribution */}
      <section className="py-8 border-t border-[#161B22]">
        <h2 className="text-[17px] font-bold text-ink mb-3">Imagery &amp; attribution</h2>
        <p className="text-[13px] text-ink-2 max-w-[74ch] leading-relaxed">
          Every comparison pair is reproduced from the supplied project dossiers: the rover-mobility
          figures come from the <em className="not-italic text-ink">Characteristic metric matrix</em>{' '}
          (Nasa Proj.docx), and the surface-science figures from{' '}
          <em className="not-italic text-ink">Final Analog Data for Surface Science</em>. Planetary
          reference frames in those dossiers are NASA and LRO products in the public domain, and
          terrestrial site photography carries the credits printed in the source material. Basemap
          tiles are served by Esri.
        </p>
      </section>

      {/* Bibliography */}
      <section className="py-8 border-t border-line">
        <h2 className="text-[17px] font-bold text-ink mb-1">Academic bibliography</h2>
        <p className="text-[13px] text-ink-2 mb-6">
          {REFERENCE_LIBRARY.length} sources underpin the scoring models and site dossiers.
        </p>
        <ol className="space-y-5">
          {REFERENCE_LIBRARY.map((ref) => (
            <li key={ref.id} className="flex gap-5">
              <span className="font-mono text-[12px] text-ink-3 shrink-0 w-8 pt-1 text-right">
                {ref.year}
              </span>
              <div className="min-w-0 border-b border-line pb-5 flex-1">
                <p className="text-[14px] text-ink font-semibold leading-snug">{ref.citation}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  {ref.doi ? (
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11.5px] text-accent hover:text-mars transition-colors"
                    >
                      doi:{ref.doi}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-mono text-[11.5px] text-ink-3">no DOI listed</span>
                  )}
                  <span className="font-mono text-[10.5px] text-ink-3 uppercase tracking-wide">
                    {ref.category}
                  </span>
                  <span className="font-mono text-[10.5px] text-ink-3">{ref.planetaryTarget}</span>
                </div>
                <p className="text-[12px] text-ink-2 mt-1.5 leading-relaxed max-w-[70ch]">
                  {ref.relevance}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
