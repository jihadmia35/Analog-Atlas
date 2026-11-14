import React from 'react';
import { AnalogSite, PurposeGroupData } from '../../types';

interface AnalogsTabProps {
  analogs: AnalogSite[];
  group: PurposeGroupData;
  onSelectAnalog: (id: string) => void;
}

export const AnalogsTab: React.FC<AnalogsTabProps> = ({ analogs, group, onSelectAnalog }) => {
  return (
    <div className="space-y-4">
      {analogs.map((site) => {
        const isMars = site.targetBody === 'Mars';
        return (
          <button
            key={site.id}
            onClick={() => onSelectAnalog(site.id)}
            className="w-full flex gap-5 text-left border border-line rounded-xl bg-surface p-4 hover:border-line-strong hover:bg-hover transition-colors group"
          >
            {/* Image left */}
            <div className="relative w-40 sm:w-56 h-28 sm:h-36 shrink-0 rounded-lg overflow-hidden bg-raised">
              <img
                src={site.heroImage}
                alt={site.heroCaption}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-2 left-2 font-mono text-[9.5px] tracking-wide px-1.5 py-0.5 rounded ${
                  isMars
                    ? 'bg-canvas/85 text-mars border border-accent/50'
                    : 'bg-canvas/85 text-moon border border-moon/40'
                }`}
              >
                {site.targetBody.toUpperCase()}
              </span>
            </div>

            {/* Name & summary right */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[16px] font-bold text-ink leading-snug group-hover:text-mars transition-colors">
                  {site.name}
                </h3>
                <div className="font-mono text-[12px] text-ink-2 shrink-0 text-right leading-tight hidden sm:block">
                  <span className="text-ink font-semibold">SI {site.siScore.toFixed(1)}%</span>
                  <span className="text-ink-3"> / EC {site.ecScore.toFixed(1)}%</span>
                </div>
              </div>

              <p className="mt-1 text-[12.5px] text-ink-2 leading-relaxed line-clamp-2">
                {site.shortSummary}
              </p>

              <div className="mt-auto pt-2 flex items-center gap-4 font-mono text-[10.5px] text-ink-3">
                <span>{site.coordinates.display}</span>
                <span className="hidden md:inline text-ink-3">→</span>
                <span className="hidden md:inline text-ink-2">{site.targetPlanetarySite}</span>
              </div>
            </div>
          </button>
        );
      })}

      <p className="text-[12px] text-ink-3 px-1 pt-1">
        Scores are computed with the {group.scoringModel.name} methodology described in the
        metrics tab.
      </p>
    </div>
  );
};
