import React, { useMemo, useState } from 'react';
import { PurposeGroupData } from '../../types';
import { Equation } from '../Equation';
import { Scale } from '../Readout';
import { useCountUp } from '../../lib/useCountUp';

interface MetricsScoringTabProps {
  group: PurposeGroupData;
}

/* ------------------------------------------------------------------ */
/* Interactive SI simulator                                            */
/*                                                                     */
/* Each metric carries a deviation slider expressed in multiples of the */
/* planetary tolerance sigma. The published rule is applied live: a    */
/* reading inside the baseline scores 1.00, a reading outside decays    */
/* linearly to 0 over two tolerances, and a characteristic with no site */
/* data stays neutral at 0.50.                                         */
/* ------------------------------------------------------------------ */

const DEFAULT_DEVIATIONS: Record<string, number> = {
  'slope-grade': 0,
  'rock-cfa': 0.5,
  'soil-sinkage': 0.25,
  'shear-strength': 0.1,
  'mineral-spectroscopy': 0.1,
  'geochem-abundance': 0.2,
  'biosig-preservation': 0.15,
  'radiation-thermal-range': 0.25,
};

/** Published characteristic score for a deviation of d tolerances outside the baseline. */
const characteristicScore = (deviation: number) =>
  deviation === 0 ? 1 : Math.max(0, 1 - deviation / 2);

const SimSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  accent?: string;
}> = ({ label, value, min, max, step, onChange, display, accent }) => (
  <label className="flex items-center gap-3 py-1.5">
    <span className="text-[12.5px] text-ink-2 w-16 shrink-0">{label}</span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="slider flex-1 min-w-0"
    />
    <span className={`font-mono text-[12px] w-20 text-right tnum ${accent ?? 'text-ink'}`}>
      {display}
    </span>
  </label>
);

const SI_SIMULATOR: React.FC<{ group: PurposeGroupData }> = ({ group }) => {
  const [deviations, setDeviations] = useState<Record<string, number>>(DEFAULT_DEVIATIONS);
  const [rawWeights, setRawWeights] = useState<Record<string, number>>(
    Object.fromEntries(group.metrics.map((m) => [m.id, m.weight]))
  );

  const weightSum = useMemo(
    () => group.metrics.reduce((sum, m) => sum + (rawWeights[m.id] ?? 0), 0) || 1,
    [rawWeights, group.metrics]
  );

  const contributions = group.metrics.map((m) => {
    const d = deviations[m.id] ?? 0;
    const w = (rawWeights[m.id] ?? 0) / weightSum;
    const s = characteristicScore(d);
    return { metric: m, deviation: d, weight: w, s, score: w * s * 100 };
  });

  const totalSi = contributions.reduce((sum, c) => sum + c.score, 0);
  const animatedSi = useCountUp(totalSi, 420);

  return (
    <section className="mt-14">
      <h2 className="text-[17px] font-semibold text-ink mb-1.5">Similarity Index simulator</h2>
      <p className="text-[13px] text-ink-2 max-w-[70ch] mb-6">
        Drag a metric's deviation to see how fidelity decays: the Earth reading sits
        <span className="text-ink"> d·σ </span>
        away from the planetary baseline. A reading inside the baseline scores 1.00, a reading
        outside decays linearly to 0 over two tolerances, and a characteristic with no site data
        stays neutral at 0.50. Weights are renormalized live.
      </p>

      <div className="panel overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="p-6 space-y-1 divide-y divide-line min-w-0">
            {contributions.map(({ metric, deviation, weight, s, score }) => (
              <div key={metric.id} className="pt-3 first:pt-0 pb-3 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3 mb-1.5">
                  <span className="text-[13px] text-ink font-medium min-w-0">
                    {metric.name}
                    <span className="ml-2">
                      <Equation tex={metric.symbol} block={false} className="text-[11px] text-ink-3" />
                    </span>
                  </span>
                  <span className="font-mono text-[11.5px] text-ink-2 tnum shrink-0">
                    w {weight.toFixed(2)} · s {s.toFixed(2)} · {score.toFixed(1)} pts
                  </span>
                </div>
                <SimSlider
                  label={`|x−b|/σ`}
                  value={deviation}
                  min={0}
                  max={3}
                  step={0.1}
                  display={`${deviation.toFixed(1)} σ`}
                  onChange={(v) => setDeviations((prev) => ({ ...prev, [metric.id]: v }))}
                  accent={deviation > 1.5 ? 'text-accent' : undefined}
                />
                <div className="mt-1.5">
                  <Scale value={s * 100} size="sm" />
                </div>
              </div>
            ))}
          </div>

          {/* Readout */}
          <div className="border-t lg:border-t-0 lg:border-l border-line bg-hover/40 p-6 flex flex-col min-w-0">
            <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3 mb-3">
              Computed similarity index
            </div>
            <div
              className={`font-mono text-[40px] font-medium leading-none tnum ${
                totalSi >= 70 ? 'text-emerald' : totalSi >= 45 ? 'text-amber' : 'text-accent'
              }`}
            >
              {animatedSi.toFixed(1)}
              <span className="text-[19px] text-ink-3">%</span>
            </div>
            <div className="mt-4">
              <Scale value={animatedSi} size="md" />
            </div>
            <p className="mt-4 text-[12px] text-ink-3 leading-relaxed">
              {totalSi >= 70
                ? 'Strong fidelity — deviations remain inside the tolerance windows.'
                : totalSi >= 45
                  ? 'Marginal — at least one characteristic has drifted past 1.5σ.'
                  : 'Poor — readings are far outside planetary tolerance; fidelity has collapsed.'}
            </p>

            <div className="mt-auto pt-6">
              <button
                onClick={() => {
                  setDeviations(DEFAULT_DEVIATIONS);
                  setRawWeights(Object.fromEntries(group.metrics.map((m) => [m.id, m.weight])));
                }}
                className="text-[12px] text-ink-2 hover:text-ink transition-colors"
              >
                Reset to catalog defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */

export const MetricsScoringTab: React.FC<MetricsScoringTabProps> = ({ group }) => {
  const { scoringModel, metrics, calculationSummary } = group;
  const weightSum = metrics.reduce((s, m) => s + m.weight, 0);

  return (
    <div className="space-y-14">
      {/* Methodology overview */}
      <section className="max-w-[74ch]">
        <h2 className="text-[17px] font-semibold text-ink mb-3">Methodology</h2>
        <p className="text-[14.5px] text-ink-2 leading-[1.75]">{scoringModel.methodologyOverview}</p>
        <p className="mt-4 font-mono text-[11px] text-ink-3">{scoringModel.name}</p>
      </section>

      {/* Equations */}
      <section>
        <h2 className="text-[17px] font-semibold text-ink mb-4">Scoring equations</h2>
        <div className="space-y-3">
          <div className="panel px-6 py-6 overflow-x-auto">
            <Equation tex={scoringModel.primaryEquation} />
          </div>
          <div className="panel px-6 py-6 overflow-x-auto">
            <Equation tex={scoringModel.environmentalCorrespondenceEquation} />
          </div>
          {scoringModel.scoringRule && (
            <div className="panel px-6 py-6 overflow-x-auto">
              <Equation tex={scoringModel.scoringRule} />
            </div>
          )}
        </div>
      </section>

      {/* Metric matrix */}
      <section>
        <h2 className="text-[17px] font-semibold text-ink mb-1">Characteristic metric matrix</h2>
        <p className="text-[13px] text-ink-2 mb-5">
          Weights sum to {weightSum.toFixed(2)} across {metrics.length} characteristics.
        </p>
        <div className="panel overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-hover/60 font-mono text-[10px] tracking-[0.06em] uppercase text-ink-3">
                <th className="px-5 py-3 font-medium">Metric</th>
                <th className="px-3 py-3 font-medium w-20">Weight</th>
                <th className="px-3 py-3 font-medium">Planetary baseline</th>
                <th className="px-3 py-3 font-medium w-40">Tolerance</th>
                <th className="px-3 py-3 font-medium">Measured by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {metrics.map((m) => (
                <tr key={m.id} className="hover:bg-hover/50 transition-colors">
                  <td className="px-5 py-4 align-top">
                    <div className="text-[13.5px] text-ink font-medium leading-snug">{m.name}</div>
                    <div className="text-accent mt-1.5">
                      <Equation tex={m.symbol} block={false} className="text-[12px]" />
                    </div>
                  </td>
                  <td className="px-3 py-4 align-top font-mono text-[13px] text-ink tnum">
                    {m.weight.toFixed(2)}
                  </td>
                  <td className="px-3 py-4 align-top">
                    <div className="text-[12.5px] text-ink-2 leading-relaxed">{m.planetaryBaseline}</div>
                    <div className="font-mono text-[10.5px] text-ink-3 mt-1">{m.unit}</div>
                  </td>
                  <td className="px-3 py-4 align-top text-[12px] text-ink-2">
                    <Equation tex={m.toleranceVariance} block={false} />
                  </td>
                  <td className="px-3 py-4 align-top text-[12px] text-ink-2 leading-relaxed">
                    {m.measurementMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Calculation summary */}
      {calculationSummary && (
        <section>
          <h2 className="text-[17px] font-semibold text-ink mb-1">Calculation summary</h2>
          <p className="text-[13px] text-ink-2 mb-5 max-w-[74ch]">{calculationSummary.note}</p>
          <div className="panel overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="bg-hover/60 font-mono text-[10px] tracking-[0.06em] uppercase text-ink-3">
                  {calculationSummary.columns.map((c) => (
                    <th key={c} className="px-3 py-3 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {calculationSummary.rows.map((row) => (
                  <tr key={row.site} className="hover:bg-hover/50 transition-colors">
                    <td className="px-3 py-3.5 text-[12.5px] text-ink font-medium">{row.site}</td>
                    {row.characteristicScores.map((s, i) => (
                      <td key={i} className="px-3 py-3.5 font-mono text-[12px] text-ink-2 tnum">
                        {s}
                      </td>
                    ))}
                    <td className="px-3 py-3.5 font-mono text-[12px] text-ink tnum">{row.si}</td>
                    <td className="px-3 py-3.5 font-mono text-[12px] text-ink tnum">{row.ec}</td>
                    <td className="px-3 py-3.5 font-mono text-[12px] text-ink-2 tnum">{row.sourceSi}</td>
                    <td className="px-3 py-3.5 font-mono text-[12px] text-ink-2 tnum">{row.sourceEc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Variables */}
      <section>
        <h2 className="text-[17px] font-semibold text-ink mb-5">Variable definitions</h2>
        <dl className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          {scoringModel.variables.map((v) => (
            <div key={v.symbol} className="flex gap-4">
              <span className="text-accent shrink-0 pt-1 min-w-[72px]">
                <Equation tex={v.symbol} block={false} className="text-[13px]" />
              </span>
              <div>
                <dt className="text-[13.5px] font-medium text-ink">{v.name}</dt>
                <dd className="text-[12.5px] text-ink-2 leading-relaxed mt-0.5">{v.definition}</dd>
                <dd className="font-mono text-[10.5px] text-ink-3 mt-1.5">typ. {v.typicalRange}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <SI_SIMULATOR group={group} />
    </div>
  );
};
