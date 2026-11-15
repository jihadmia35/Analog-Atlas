import React, { useEffect, useRef, useState } from 'react';
import { PurposeGroupData, AnalogSite } from '../../types';
import { MetricsScoringTab } from './MetricsScoringTab';
import { AnalogsTab } from './AnalogsTab';
import { AnalogDossier } from '../analog/AnalogDossier';
import { ChevronLeft } from 'lucide-react';

interface PurposeGroupViewProps {
  groupData: PurposeGroupData;
  analogs: AnalogSite[];
  /** Site resolved from the full catalog, so a filtered-out site still opens */
  selectedSite?: AnalogSite;
  selectedAnalogId?: string;
  onSelectAnalog: (id: string | undefined) => void;
}

type TabId = 'metrics' | 'analogs';

export const PurposeGroupView: React.FC<PurposeGroupViewProps> = ({
  groupData,
  analogs,
  selectedSite: selectedSiteProp,
  selectedAnalogId,
  onSelectAnalog,
}) => {
  const [tab, setTab] = useState<TabId>('metrics');
  const tabStripRef = useRef<HTMLDivElement>(null);
  const [tabIndicator, setTabIndicator] = useState<{ left: number; width: number } | null>(null);

  // Underline slides between the tabs rather than blinking on and off
  useEffect(() => {
    const strip = tabStripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-tab="${tab}"]`);
    if (!active) return;
    setTabIndicator({ left: active.offsetLeft + 16, width: active.offsetWidth - 32 });
  }, [tab]);

  const selectedSite = selectedSiteProp ?? analogs.find((a) => a.id === selectedAnalogId);

  // Dossier replaces the tabbed view entirely
  if (selectedSite) {
    return (
      <div>
        <button
          onClick={() => onSelectAnalog(undefined)}
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to {groupData.id === 'rover-mobility' ? 'rover mobility' : 'surface science'} analogs
        </button>
        <AnalogDossier site={selectedSite} group={groupData} />
      </div>
    );
  }

  return (
    <div>
      {/* Group header */}
      <header className="panel overflow-hidden mb-8">
        <div className="px-6 sm:px-9 pt-8 pb-7">
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <h1 className="text-[clamp(24px,3.4vw,34px)] font-bold tracking-[-0.03em] text-ink leading-tight">
              {groupData.title}
            </h1>
            <span className="font-mono text-[11px] text-ink-3 tnum">
              {analogs.length} verified analogs
            </span>
          </div>
          <p className="mt-3 text-[14.5px] text-ink-2 max-w-[72ch] leading-relaxed">
            {groupData.tagline}
          </p>
        </div>

        {/* Tabs */}
        <div ref={tabStripRef} className="flex gap-1 border-t border-line px-4 sm:px-7 relative">
          {(
            [
              ['metrics', 'Metrics & scoring'],
              ['analogs', `Analogs (${analogs.length})`],
            ] as Array<[TabId, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              data-tab={id}
              onClick={() => setTab(id)}
              aria-selected={tab === id}
              role="tab"
              className={`relative px-4 py-3.5 text-[13.5px] font-medium transition-colors duration-200 ${
                tab === id ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
          {tabIndicator && (
            <span
              className="absolute -bottom-px h-[2px] bg-accent rounded-full transition-all duration-300 ease-out"
              style={{ left: tabIndicator.left, width: tabIndicator.width }}
            />
          )}
        </div>
      </header>

      {tab === 'metrics' ? (
        <MetricsScoringTab group={groupData} />
      ) : (
        <AnalogsTab analogs={analogs} group={groupData} onSelectAnalog={onSelectAnalog} />
      )}
    </div>
  );
};
