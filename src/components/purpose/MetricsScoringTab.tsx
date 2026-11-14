import React, { useMemo, useState } from 'react';
import { PurposeGroupData } from '../../types';
import { Equation } from '../Equation';

interface MetricsScoringTabProps {
  group: PurposeGroupData;
}

/* ------------------------------------------------------------------ */
/* Interactive SI simulator                                            */
/*                                                                     */
/* The user drags a per-metric deviation slider (measured Earth value  */
/* expressed in multiples of the planetary tolerance σ away from the   */
/* baseline) and allocates weights. Every value is scored with the     */
/* same exponential kernel used in the Similarity Index.               */
/* ------------------------------------------------------------------ */

const DEFAULT_DEVIATIONS: Record<string, number> = {
  'slope-grade': 0.2,
  'rock-cfa': 0.15,
  'soil-sinkage': 0.25,
  'shear-strength': 0.1,
  'mineral-spectroscopy': 0.1,
  'geochem-abundance': 0.2,
  'biosig-preservation': 0.15,
  'radiation-thermal-range': 0.25,
};

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
    <span className={`font-mono text-[12px] w-20 text-right ${accent ?? 'text-ink'}`}>
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
    const score = w * Math.exp(-Math.abs(d)) * 100;
    return { metric: m, deviation: d, weight: w, score };
  });

  const totalSi = contributions.reduce((sum, c) => sum + c.score, 0);

  return (
    <section className="mt-12">
      <h2 className="text-[17px] font-bold text-ink mb-1">Similarity Index simulator</h2>
      <p className="text-[13px] text-ink-2 max-w-[70ch] mb-5">
        Drag a metric's deviation to see how quickly fidelity decays: the Earth reading sits
        <span className="text-ink"> d·σ </span>
        away from the planetary baseline, and the exponential kernel does the rest. Weights are
        renormalized live.
      </p>

      <div className="border border-line rounded-xl bg-surface overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_260px]">
          <div className="p-5 space-y-1 divide-y divide-line">
            {contributions.map(({ metric, deviation, weight, score }) => (
              <div key={metric.id} className="pt-2 first:pt-0 pb-2">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[13px] text-ink font-medium">
                    {metric.name}
                    <span className="font-mono text-[11px] text-ink-3 ml-2">{metric.symbol}</span>
                  </span>
                  <span className="font-mono text-[11.5px] text-ink-2">
                    w {weight.toFixed(2)} · {score.toFixed(1)} pts
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
                <div className="h-[3px] rounded-full bg-raised mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent/80 transition-all duration-150"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Readout */}
          <div className="border-t lg:border-t-0 lg:border-l border-line bg-canvas p-5 flex flex-col">
            <div className="font-mono text-[10.5px] tracking-wide text-ink-3 mb-2">
              COMPUTED SI
            </div>
            <div
              className={`font-mono text-[42px] font-semibold leading-none ${
                totalSi >= 70 ? 'text-emerald' : totalSi >= 45 ? 'text-amber' : 'text-accent'
              }`}
            >
              {totalSi.toFixed(1)}
              <span className="text-[20px] text-ink-3">%</span>
            </div>
            <p className="mt-3 text-[12px] text-ink-3 leading-relaxed">
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
  const { scoringModel, metrics } = group;
  const weightSum = metrics.reduce((s, m) => s + m.weight, 0);

  return (
    <div className="space-y-12">
      {/* Methodology overview */}
      <section className="max-w-[74ch]">
        <h2 className="text-[17px] font-bold text-ink mb-3">Methodology</h2>
        <p className="text-[14.5px] text-ink-2 leading-[1.75]">{scoringModel.methodologyOverview}</p>
        <p className="mt-3 text-[12px] font-mono text-ink-3">{scoringModel.name}</p>
      </section>

      {/* Equations */}
      <section>
        <h2 className="text-[17px] font-bold text-ink mb-4">Scoring equations</h2>
        <div className="space-y-3">
          <div className="border border-line rounded-xl bg-surface px-6 py-6 overflow-x-auto">
            <Equation tex={scoringModel.primaryEquation} />
          </div>
          <div className="border border-line rounded-xl bg-surface px-6 py-6 overflow-x-auto">
            <Equation tex={scoringModel.environmentalCorrespondenceEquation} />
          </div>
        </div>
      </section>

      {/* Metric matrix */}
      <section>
        <h2 className="text-[17px] font-bold text-ink mb-1">Characteristic metric matrix</h2>
        <p className="text-[13px] text-ink-2 mb-5">
          Weights sum to {weightSum.toFixed(2)} across {metrics.length} characteristics.
        </p>
        <div className="border border-line rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-surface font-mono text-[10.5px] tracking-wide text-ink-3">
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-3 py-3 font-medium w-20">Weight</th>
                <th className="px-3 py-3 font-medium">Planetary baseline</th>
                <th className="px-3 py-3 font-medium w-40">Tolerance</th>
                <th className="px-3 py-3 font-medium">Measured by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {metrics.map((m) => (
                <tr key={m.id} className="hover:bg-hover transition-colors">
                  <td className="px-4 py-3.5 align-top">
                    <div className="text-[13.5px] text-ink font-semibold leading-snug">{m.name}</div>
                    <div className="text-accent mt-1">
                      <Equation tex={m.symbol} block={false} className="text-[12px]" />
                    </div>
                  </td>
                  <td className="px-3 py-3.5 align-top font-mono text-[13px] text-ink">
                    {m.weight.toFixed(2)}
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <div className="text-[12.5px] text-ink-2 leading-relaxed">{m.planetaryBaseline}</div>
                    <div className="font-mono text-[10.5px] text-ink-3 mt-0.5">{m.unit}</div>
                  </td>
                  <td className="px-3 py-3.5 align-top text-[12px] text-ink-2">
                    <Equation tex={m.toleranceVariance} block={false} />
                  </td>
                  <td className="px-3 py-3.5 align-top text-[12px] text-ink-2 leading-relaxed">
                    {m.measurementMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Variables */}
      <section>
        <h2 className="text-[17px] font-bold text-ink mb-4">Variable definitions</h2>
        <dl className="grid md:grid-cols-2 gap-x-10 gap-y-5">
          {scoringModel.variables.map((v) => (
            <div key={v.symbol} className="flex gap-4">
              <span className="text-accent shrink-0 pt-1 min-w-[72px]">
                <Equation tex={v.symbol} block={false} className="text-[13px]" />
              </span>
              <div>
                <dt className="text-[13.5px] font-semibold text-ink">{v.name}</dt>
                <dd className="text-[12.5px] text-ink-2 leading-relaxed mt-0.5">{v.definition}</dd>
                <dd className="font-mono text-[10.5px] text-ink-3 mt-1">typ. {v.typicalRange}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <SI_SIMULATOR group={group} />
    </div>
  );
};
