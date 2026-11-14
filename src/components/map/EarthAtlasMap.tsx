import React from 'react';
import { AnalogSite } from '../../types';
import { LeafletWorldMap, Theme } from './LeafletWorldMap';

interface EarthAtlasMapProps {
  analogs: AnalogSite[];
  selectedAnalogId?: string;
  onSelectAnalog: (analogId: string) => void;
  theme: Theme;
  className?: string;
}

export const EarthAtlasMap: React.FC<EarthAtlasMapProps> = ({
  analogs,
  selectedAnalogId,
  onSelectAnalog,
  theme,
  className = '',
}) => {
  return (
    <div className={className}>
      <LeafletWorldMap
        analogs={analogs}
        selectedAnalogId={selectedAnalogId}
        onSelectAnalog={onSelectAnalog}
        theme={theme}
      />
      <p className="mt-2.5 text-[12px] text-ink-3">
        Click a pin to preview the site; open the dossier for full metrics, evidence and limitations.
      </p>
    </div>
  );
};
