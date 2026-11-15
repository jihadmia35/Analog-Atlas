import React from 'react';
import { AnalogSite, PurposeGroupData } from '../../types';
import { ImageComparisonSlider } from '../comparison/ImageComparisonSlider';
import { Equation } from '../Equation';
import { Readout, Scale } from '../Readout';

interface AnalogDossierProps {
  site: AnalogSite;
  group: PurposeGroupData;
}

const SectionTitle: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
  <h2 id={id} className="text-[17px] font-semibold text-ink mb-5 flex items-center gap-3">
    <span className="w-1 h-4 rounded-full bg-accent/70" />
    {children}
  </h2>
);

export const AnalogDossier: React.FC<AnalogDossierProps> = ({ site, group }) => {
  const metricNameById = Object.fromEntries(group.metrics.map((m) => [m.id, m]));

  return (
    <article className="max-w-[1100px] stagger">
      {/* Title block */}
      <header className="panel overflow-hidden mb-8">
        <div className="px-6 sm:px-9 pt-8 pb-7">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[10.5px] tracking-[0.06em]">
            <span
              className={`px-2 py-0.5 rounded border ${
                site.targetBody === 'Mars'
                  ? 'border-accent/50 text-mars'
                  : 'border-moon/40 text-moon'
              }`}
            >
              {site.targetBody.toUpperCase()} TARGET
            </span>
            <span className="text-ink-3 uppercase">{site.continent}</span>
            <span className="text-line-strong">/</span>
            <span className="text-ink-2 tnum">{site.coordinates.display}</span>
            <span className="text-line-strong">/</span>
            <span className="text-ink-2">{site.regionName}</span>
          </div>

          <h1 className="mt-4 text-[clamp(26px,4vw,38px)] font-bold tracking-[-0.03em] text-ink leading-[1.05]">
            {site.name}
          </h1>
          <p className="mt-3 text-[14.5px] text-ink-2 max-w-[68ch] leading-relaxed">
            {site.shortSummary}
          </p>
          <p className="mt-4 text-[12px] font-mono text-ink-3 leading-relaxed">{site.profileLine}</p>
        </div>

        {/* Scores */}
        <div className="grid sm:grid-cols-2 border-t border-line">
          <div className="px-6 sm:px-9 py-6">
            <Readout
              label="Similarity index"
              value={site.siScore}
              size="lg"
              note={`Weighted characteristic fit · ${group.scoringModel.name}`}
            />
          </div>
          <div className="px-6 sm:px-9 py-6 sm:border-l sm:border-line border-t sm:border-t-0">
            <Readout
              label="Environmental correspondence"
              value={site.ecScore}
              size="lg"
              tone="quiet"
              note="Evidence-weighted correspondence"
            />
          </div>
        </div>
        {site.scoreNote && (
          <p className="px-6 sm:px-9 py-4 border-t border-line font-mono text-[11px] text-ink-3 leading-relaxed">
            {site.scoreNote}
          </p>
        )}
      </header>

      {/* Morphological comparison */}
      <section className="mb-10">
        <SectionTitle>Morphological comparison</SectionTitle>
        <ImageComparisonSlider
          earthImage={site.heroImage}
          targetImage={site.targetImage}
          earthCaption={site.heroCaption}
          targetCaption={site.targetCaption}
          targetBody={site.targetBody}
        />
      </section>

      {/* Metric table */}
      <section className="mb-12">
        <SectionTitle>Measured characteristics</SectionTitle>
        <div className="panel overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-hover/60 font-mono text-[10px] tracking-[0.06em] uppercase text-ink-3">
                <th className="px-5 py-3 font-medium">Metric</th>
                <th className="px-3 py-3 font-medium">Earth</th>
                <th className="px-3 py-3 font-medium">Planetary</th>
                <th className="px-3 py-3 font-medium w-28">Score (s)</th>
                <th className="px-3 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {site.metricValues.map((mv) => {
                const def = metricNameById[mv.metricId];
                return (
                  <tr key={mv.metricId} className="hover:bg-hover/50 transition-colors">
                    <td className="px-5 py-4 align-top">
                      <div className="text-[13px] text-ink font-medium">{def?.name ?? mv.metricId}</div>
                      <div className="text-[11px] text-ink-3 mt-1.5 flex items-center gap-2">
                        <Equation tex={def?.symbol ?? mv.metricId} block={false} />
                        <span className="font-mono tnum">· w {def?.weight.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 align-top font-mono text-[12.5px] text-ink leading-relaxed">
                      {mv.earthValue}
                      {mv.unit && <span className="text-ink-3 text-[10.5px]"> {mv.unit}</span>}
                    </td>
                    <td className="px-3 py-4 align-top font-mono text-[12.5px] text-ink-2 leading-relaxed">
                      {mv.planetaryValue}
                    </td>
                    <td className="px-3 py-4 align-top">
                      {mv.individualScore === undefined ? (
                        <span className="font-mono text-[11.5px] text-ink-3">not scored</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-10">
                            <Scale value={mv.individualScore * 100} size="sm" />
                          </span>
                          <span className="font-mono text-[11.5px] text-ink tnum">
                            {mv.individualScore.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 align-top text-[12px] text-ink-2 leading-relaxed">
                      {mv.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Evidence */}
      <section className="mb-12">
        <SectionTitle>Field evidence</SectionTitle>
        <p className="text-[14px] text-ink-2 leading-[1.75] max-w-[74ch]">{site.evidence.dataSummary}</p>

        <div className="mt-6 panel overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-hover/60 font-mono text-[10px] tracking-[0.06em] uppercase text-ink-3">
                <th className="px-5 py-3 font-medium">Parameter</th>
                <th className="px-3 py-3 font-medium">Earth reading</th>
                <th className="px-3 py-3 font-medium">Planetary reference</th>
                <th className="px-3 py-3 font-medium">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {site.evidence.keyMeasurements.map((k) => (
                <tr key={k.parameter} className="hover:bg-hover/50 transition-colors">
                  <td className="px-5 py-3.5 text-[12.5px] text-ink font-medium align-top">
                    {k.parameter}
                  </td>
                  <td className="px-3 py-3.5 font-mono text-[12px] text-ink align-top leading-relaxed">
                    {k.earthData}
                  </td>
                  <td className="px-3 py-3.5 font-mono text-[12px] text-ink-2 align-top leading-relaxed">
                    {k.planetaryData}
                  </td>
                  <td className="px-3 py-3.5 text-[12px] text-ink-2 align-top leading-relaxed">
                    {k.significance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mismatches */}
      <section className="mb-12">
        <SectionTitle>Terrestrial mismatch disclosures</SectionTitle>
        <p className="text-[12.5px] text-ink-3 mb-6 max-w-[70ch]">
          No Earth site closes every gap. These are the discrepancies any field campaign here must
          design around.
        </p>
        <dl className="panel divide-y divide-line">
          {site.mismatches.map((m) => (
            <div key={m.label} className="grid sm:grid-cols-[200px_1fr] gap-x-8 gap-y-1 px-6 py-4">
              <dt className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-accent/90 pt-0.5">
                {m.label}
              </dt>
              <dd className="text-[12.5px] text-ink-2 leading-relaxed">{m.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Publications & resources */}
      <section className="mb-12">
        <SectionTitle>Publications &amp; datasets</SectionTitle>
        <ul className="space-y-3">
          {site.evidence.publications.map((p) => (
            <li key={p.citation} className="flex gap-4">
              <span className="font-mono text-[11px] text-ink-3 shrink-0 w-10 pt-1 tnum">
                {p.citation.match(/\((\d{4})\)/)?.[1] ?? ''}
              </span>
              <div>
                <span className="text-[13.5px] text-ink font-medium leading-snug">{p.citation}</span>
                {p.doi && (
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11.5px] text-accent hover:text-mars transition-colors mt-1 inline-block link-underline"
                  >
                    doi:{p.doi}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        {site.resources.datasets.length > 0 && (
          <div className="mt-8 panel px-6 py-5">
            <h3 className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3 mb-3">
              Open datasets
            </h3>
            <ul className="space-y-2.5">
              {site.resources.datasets.map((d) => (
                <li key={d.name} className="text-[12.5px]">
                  <span className="text-ink">{d.name}</span>
                  <span className="block font-mono text-[11px] text-ink-3 mt-0.5">
                    {d.type} · {d.source}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </article>
  );
};
