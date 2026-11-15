import React from 'react';
import { AnalogSite, PurposeGroupData } from '../../types';
import { Scale } from '../Readout';
import { ChevronRight } from 'lucide-react';
import { prefetchSiteImages } from '../../lib/prefetchAnalogs';

interface AnalogsTabProps {
  analogs: AnalogSite[];
  group: PurposeGroupData;
  onSelectAnalog: (id: string) => void;
}

export const AnalogsTab: React.FC<AnalogsTabProps> = ({ analogs, group, onSelectAnalog }) => {
  return (
    <div className="space-y-3">
      {analogs.map((site) => {
        const isMars = site.targetBody === 'Mars';
        return (
          <button
            key={site.id}
            onClick={() => onSelectAnalog(site.id)}
            onMouseEnter={() => prefetchSiteImages(site)}
            onFocus={() => prefetchSiteImages(site)}
            className="w-full flex flex-col sm:flex-row gap-5 text-left panel panel-lift overflow-hidden group"
          >
            {/* Image */}
            <div className="relative w-full sm:w-64 h-44 sm:h-auto sm:min-h-[164px] shrink-0 overflow-hidden bg-raised">
              <img
                src={site.heroImage}
                alt={site.heroCaption}
                loading="lazy"
                onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                className="img-fade absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              <span
                className={`absolute top-3 left-3 font-mono text-[9.5px] tracking-[0.06em] px-1.5 py-0.5 rounded backdrop-blur-sm ${
                  isMars
                    ? 'bg-canvas/85 text-mars border border-accent/50'
                    : 'bg-canvas/85 text-moon border border-moon/40'
                }`}
              >
                {site.targetBody.toUpperCase()}
              </span>
            </div>

            {/* Name & summary */}
            <div className="flex-1 min-w-0 flex flex-col px-5 pb-5 sm:py-5 sm:pr-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[16px] font-semibold text-ink leading-snug tracking-[-0.01em] group-hover:text-mars transition-colors duration-200">
                  {site.name}
                </h3>
                <div className="font-mono text-[12px] text-ink-2 shrink-0 text-right leading-tight hidden sm:block">
                  <span className="text-ink tnum">SI {site.siScore.toFixed(1)}</span>
                  <span className="text-ink-3 tnum"> / EC {site.ecScore.toFixed(1)}</span>
                </div>
              </div>

              <p className="mt-1.5 text-[12.5px] text-ink-2 leading-relaxed line-clamp-2">
                {site.shortSummary}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="inline-block w-16">
                  <Scale value={site.siScore} size="sm" />
                </span>
                <span className="font-mono text-[10.5px] text-ink-3 tnum">
                  {site.coordinates.display}
                </span>
                <span className="hidden md:inline text-line-strong">→</span>
                <span className="hidden md:inline text-[11.5px] text-ink-2">{site.targetPlanetarySite}</span>
                <span className="ml-auto hidden md:inline-flex items-center gap-1 text-[11.5px] text-ink-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Open dossier
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </button>
        );
      })}

      <p className="text-[12px] text-ink-3 px-1 pt-3">
        Scores are computed with the {group.scoringModel.name} methodology described in the
        metrics tab.
      </p>
    </div>
  );
};
