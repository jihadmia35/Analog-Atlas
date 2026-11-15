import React, { useState } from 'react';
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

  const selectedSite =
    selectedSiteProp ?? analogs.find((a) => a.id === selectedAnalogId);

  // Dossier replaces the tabbed view entirely
  if (selectedSite) {
    return (
      <div className="animate-rise">
        <button
          onClick={() => onSelectAnalog(undefined)}
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink transition-colors mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {groupData.id === 'rover-mobility' ? 'rover mobility' : 'surface science'} analogs
        </button>
        <AnalogDossier site={selectedSite} group={groupData} />
      </div>
    );
  }

  return (
    <div className="animate-rise">
      {/* Group header */}
      <header className="pb-6 mb-2 border-b border-line">
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-ink leading-tight">
            {groupData.title}
          </h1>
          <span className="font-mono text-[12px] text-ink-3">
            {analogs.length} verified analogs
          </span>
        </div>
        <p className="mt-2 text-[14.5px] text-ink-2 max-w-[72ch] leading-relaxed">
          {groupData.tagline}
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line mb-8">
        {(
          [
            ['metrics', 'Metrics & scoring'],
            ['analogs', `Analogs (${analogs.length})`],
          ] as Array<[TabId, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-selected={tab === id}
            role="tab"
            className={`relative px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
              tab === id ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            {label}
            {tab === id && (
              <span className="absolute left-4 right-4 -bottom-px h-[2px] bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {tab === 'metrics' ? (
        <MetricsScoringTab group={groupData} />
      ) : (
        <AnalogsTab analogs={analogs} group={groupData} onSelectAnalog={onSelectAnalog} />
      )}
    </div>
  );
};
