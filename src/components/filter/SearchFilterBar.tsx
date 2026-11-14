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
      className="appearance-none bg-surface border border-line rounded-md pl-3 pr-8 py-1.5 text-[12.5px] text-ink hover:border-line-strong focus:border-accent/60 transition-colors cursor-pointer"
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
    filterState.minSiScore === 75;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Search */}
      <label className="relative flex-1 min-w-[220px]">
        <span className="sr-only">Search analog sites</span>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" />
        <input
          type="search"
          value={filterState.searchQuery}
          onChange={(e) => onFilterChange({ ...filterState, searchQuery: e.target.value })}
          placeholder="Search sites, target regions, terrain…"
          className="w-full bg-surface border border-line rounded-md pl-9 pr-3 py-1.5 text-[13px] text-ink placeholder:text-ink-3/70 hover:border-line-strong focus:border-accent/60 transition-colors"
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
          { value: 'Iceland', label: 'Iceland' },
          { value: 'South Asia', label: 'South Asia' },
          { value: 'North America', label: 'North America' },
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

      <label className="flex items-center gap-2.5 bg-surface border border-line rounded-md pl-3 pr-3 py-1.5 hover:border-line-strong transition-colors">
        <span className="text-[12.5px] text-ink-3 whitespace-nowrap">SI ≥</span>
        <input
          type="range"
          min={75}
          max={93}
          step={1}
          value={filterState.minSiScore}
          onChange={(e) => onFilterChange({ ...filterState, minSiScore: Number(e.target.value) })}
          className="slider w-24"
          aria-label="Minimum similarity index"
        />
        <span className="font-mono text-[12px] text-ink w-6 text-right">{filterState.minSiScore}</span>
      </label>

      {!isDefault && (
        <button
          onClick={() =>
            onFilterChange({
              searchQuery: '',
              targetBody: 'All',
              purposeGroup: 'All',
              continent: 'All',
              minSiScore: 75,
            })
          }
          className="flex items-center gap-1.5 text-[12px] text-ink-2 hover:text-ink px-2 py-1.5 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      )}

      <span className="font-mono text-[11.5px] text-ink-3 ml-auto">
        {totalResults}/{totalCount} sites
      </span>
    </div>
  );
};
