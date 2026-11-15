import React from 'react';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';
import { FilterState } from '../../types';

interface SearchFilterBarProps {
  filterState: FilterState;
  onFilterChange: (next: FilterState) => void;
  totalResults: number;
  totalCount: number;
}

const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  label: string;
}> = ({ value, onChange, options, label }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="appearance-none bg-surface border border-line rounded-lg pl-3 pr-8 py-[7px] text-[12.5px] text-ink hover:border-line-strong focus:border-accent/60 transition-colors cursor-pointer shadow-panel"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown
      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none"
      strokeWidth={2}
    />
  </div>
);

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filterState,
  onFilterChange,
  totalResults,
  totalCount,
}) => {
  const isDefault =
    filterState.searchQuery === '' &&
    filterState.targetBody === 'All' &&
    filterState.purposeGroup === 'All' &&
    filterState.continent === 'All' &&
    filterState.minSiScore === 50;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <label className="relative w-full sm:flex-1 sm:min-w-[220px] sm:w-auto">
        <span className="sr-only">Search analog sites</span>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" />
        <input
          type="search"
          value={filterState.searchQuery}
          onChange={(e) => onFilterChange({ ...filterState, searchQuery: e.target.value })}
          placeholder="Search sites, target regions, terrain…"
          className="w-full bg-surface border border-line rounded-lg pl-9 pr-3 py-[7px] text-[13px] text-ink placeholder:text-ink-3/70 hover:border-line-strong focus:border-accent/60 transition-colors shadow-panel"
        />
      </label>

      <Select
        label="Filter by target body"
        value={filterState.targetBody}
        onChange={(v) => onFilterChange({ ...filterState, targetBody: v as FilterState['targetBody'] })}
        options={[
          { value: 'All', label: 'All targets' },
          { value: 'Mars', label: 'Mars' },
          { value: 'Moon', label: 'Moon' },
        ]}
      />

      <Select
        label="Filter by province"
        value={filterState.continent}
        onChange={(v) => onFilterChange({ ...filterState, continent: v as FilterState['continent'] })}
        options={[
          { value: 'All', label: 'All provinces' },
          { value: 'Antarctica', label: 'Antarctica' },
          { value: 'South Asia', label: 'South Asia' },
          { value: 'East Asia', label: 'East Asia' },
          { value: 'South America', label: 'South America' },
        ]}
      />

      <Select
        label="Filter by purpose group"
        value={filterState.purposeGroup}
        onChange={(v) =>
          onFilterChange({ ...filterState, purposeGroup: v as FilterState['purposeGroup'] })
        }
        options={[
          { value: 'All', label: 'All purposes' },
          { value: 'rover-mobility', label: 'Rover mobility' },
          { value: 'surface-science', label: 'Surface science' },
        ]}
      />

      <label className="flex items-center gap-2.5 bg-surface border border-line rounded-lg pl-3 pr-3 py-[5px] hover:border-line-strong transition-colors shadow-panel">
        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3">SI min</span>
        <input
          type="range"
          min={50}
          max={63}
          step={0.5}
          value={filterState.minSiScore}
          onChange={(e) => onFilterChange({ ...filterState, minSiScore: Number(e.target.value) })}
          className="slider w-24"
          aria-label="Minimum similarity index"
        />
        <span className="font-mono text-[12px] text-ink w-9 text-right tnum">
          {filterState.minSiScore.toFixed(1)}
        </span>
      </label>

      {!isDefault && (
        <button
          onClick={() =>
            onFilterChange({
              searchQuery: '',
              targetBody: 'All',
              purposeGroup: 'All',
              continent: 'All',
              minSiScore: 50,
            })
          }
          className="flex items-center gap-1.5 text-[12px] text-ink-2 hover:text-ink px-2 py-1.5 rounded-lg transition-colors hover:bg-hover"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      )}

      <span className="font-mono text-[11.5px] text-ink-3 ml-auto tnum">
        {totalResults}/{totalCount} sites
      </span>
    </div>
  );
};
