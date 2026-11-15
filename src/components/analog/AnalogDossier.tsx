import React from 'react';
import { AnalogSite, PurposeGroupData } from '../../types';
import { ImageComparisonSlider } from '../comparison/ImageComparisonSlider';
import { Equation } from '../Equation';

interface AnalogDossierProps {
  site: AnalogSite;
  group: PurposeGroupData;
}

const SectionTitle: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
  <h2 id={id} className="text-[17px] font-bold text-ink mb-4">
    {children}
  </h2>
);

const ScoreBar: React.FC<{ label: string; value: number; note: string }> = ({ label, value, note }) => (
  <div>
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-[10.5px] tracking-wide text-ink-3">{label}</span>
      <span className="font-mono text-[15px] text-ink font-semibold">{value.toFixed(1)}%</span>
    </div>
    <div className="h-[3px] rounded-full bg-line mt-2 overflow-hidden">
      <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
    </div>
    <p className="text-[10.5px] text-ink-3 mt-1.5">{note}</p>
  </div>
);

export const AnalogDossier: React.FC<AnalogDossierProps> = ({ site, group }) => {
  const metricNameById = Object.fromEntries(group.metrics.map((m) => [m.id, m]));

  return (
    <article className="max-w-[1100px]">
      {/* Title block */}
      <header className="border-b border-line pb-6">
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-[10.5px] tracking-wide">
          <span
            className={`px-2 py-0.5 rounded border ${
              site.targetBody === 'Mars'
                ? 'border-accent/50 text-mars'
                : 'border-moon/40 text-moon'
            }`}
          >
            {site.targetBody.toUpperCase()} TARGET
          </span>
          <span className="text-ink-3">{site.continent.toUpperCase()}</span>
          <span className="text-ink-3">/</span>
          <span className="text-ink-2">{site.coordinates.display}</span>
          <span className="text-ink-3">/</span>
          <span className="text-ink-2">{site.regionName}</span>
        </div>
        <h1 className="mt-3 text-[28px] sm:text-[36px] font-extrabold tracking-tight text-ink leading-tight">
          {site.name}
        </h1>
        <p className="mt-2 text-[14.5px] text-ink-2 max-w-[72ch] leading-relaxed">
          {site.shortSummary}
        </p>
        <p className="mt-3 text-[12.5px] font-mono text-ink-3">{site.profileLine}</p>
      </header>

      {/* Scores */}
      <section className="grid sm:grid-cols-2 gap-6 py-6 border-b border-line">
        <ScoreBar
          label="SIMILARITY INDEX"
          value={site.siScore}
          note={`Weighted characteristic fit · ${group.scoringModel.name}`}
        />
        <ScoreBar
          label="ENVIRONMENTAL CORRESPONDENCE"
          value={site.ecScore}
          note="Evidence-weighted correspondence"
        />
        {site.scoreNote && (
          <p className="sm:col-span-2 font-mono text-[11px] text-ink-3 leading-relaxed">
            {site.scoreNote}
          </p>
        )}
      </section>

      {/* Morphological comparison */}
      <section className="py-8">
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
      <section className="py-8 border-t border-line">
        <SectionTitle>Measured characteristics</SectionTitle>
        <div className="border border-line rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-surface font-mono text-[10.5px] tracking-wide text-ink-3">
                <th className="px-4 py-3 font-medium">Metric</th>
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
                  <tr key={mv.metricId} className="hover:bg-hover transition-colors">
                    <td className="px-4 py-3.5 align-top">
                      <div className="text-[13px] text-ink font-semibold">{def?.name ?? mv.metricId}</div>
                      <div className="text-[11px] text-ink-3 mt-1 flex items-center gap-2">
                        <Equation tex={def?.symbol ?? mv.metricId} block={false} />
                        <span className="font-mono">· w {def?.weight.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 align-top font-mono text-[12.5px] text-ink">
                      {mv.earthValue}
                      {mv.unit && <span className="text-ink-3 text-[10.5px]"> {mv.unit}</span>}
                    </td>
                    <td className="px-3 py-3.5 align-top font-mono text-[12.5px] text-ink-2">
                      {mv.planetaryValue}
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      {mv.individualScore === undefined ? (
                        <span className="font-mono text-[11.5px] text-ink-3">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-[3px] flex-1 rounded-full bg-line overflow-hidden">
                            <div
                              className="h-full bg-accent"
                              style={{ width: `${mv.individualScore * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11.5px] text-ink w-9 text-right">
                            {mv.individualScore.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3.5 align-top text-[12px] text-ink-2 leading-relaxed">
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
      <section className="py-8 border-t border-line">
        <SectionTitle>Field evidence</SectionTitle>
        <p className="text-[14px] text-ink-2 leading-[1.75] max-w-[74ch]">
          {site.evidence.dataSummary}
        </p>

        <div className="mt-6 border border-line rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-surface font-mono text-[10.5px] tracking-wide text-ink-3">
                <th className="px-4 py-3 font-medium">Parameter</th>
                <th className="px-3 py-3 font-medium">Earth reading</th>
                <th className="px-3 py-3 font-medium">Planetary reference</th>
                <th className="px-3 py-3 font-medium">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {site.evidence.keyMeasurements.map((k) => (
                <tr key={k.parameter}>
                  <td className="px-4 py-3 text-[12.5px] text-ink font-medium align-top">{k.parameter}</td>
                  <td className="px-3 py-3 font-mono text-[12px] text-ink align-top">{k.earthData}</td>
                  <td className="px-3 py-3 font-mono text-[12px] text-ink-2 align-top">
                    {k.planetaryData}
                  </td>
                  <td className="px-3 py-3 text-[12px] text-ink-2 align-top leading-relaxed">
                    {k.significance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mismatches */}
      <section className="py-8 border-t border-line">
        <SectionTitle>Terrestrial mismatch disclosures</SectionTitle>
        <p className="text-[12.5px] text-ink-3 mb-5 max-w-[70ch]">
          No Earth site closes every gap. These are the discrepancies any field campaign here must
          design around.
        </p>
        <dl className="grid md:grid-cols-2 gap-x-10 gap-y-5">
          {site.mismatches.map((m) => (
            <div key={m.label} className="flex gap-4">
              <dt className="font-mono text-[10.5px] tracking-wide text-accent shrink-0 w-36 pt-1 uppercase">
                {m.label}
              </dt>
              <dd className="text-[12.5px] text-ink-2 leading-relaxed">{m.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Publications & resources */}
      <section className="py-8 border-t border-line">
        <SectionTitle>Publications &amp; datasets</SectionTitle>
        <ul className="space-y-3">
          {site.evidence.publications.map((p) => (
            <li key={p.citation} className="flex gap-4">
              <span className="font-mono text-[11px] text-ink-3 shrink-0 w-10 pt-1">
                {p.citation.match(/\((\d{4})\)/)?.[1] ?? ''}
              </span>
              <div>
                <span className="text-[13.5px] text-ink font-medium leading-snug">{p.citation}</span>
                {p.doi && (
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11.5px] text-accent hover:text-mars transition-colors mt-1 inline-block"
                  >
                    doi:{p.doi}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        {site.resources.datasets.length > 0 && (
          <div className="mt-8">
            <h3 className="font-mono text-[10.5px] tracking-wide text-ink-3 mb-3">OPEN DATASETS</h3>
            <ul className="space-y-2.5">
              {site.resources.datasets.map((d) => (
                <li key={d.name} className="text-[12.5px]">
                  <span className="text-ink">{d.name}</span>
                  <span className="block text-[11.5px] text-ink-3">
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
