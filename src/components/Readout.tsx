import React from 'react';

type Size = 'sm' | 'md' | 'lg';

const SEGMENTS: Record<Size, { count: number; className: string }> = {
  sm: { count: 16, className: 'readout readout-sm' },
  md: { count: 24, className: 'readout' },
  lg: { count: 32, className: 'readout readout-lg' },
};

interface ScaleProps {
  /** 0–100 unless `max` is given */
  value: number;
  max?: number;
  size?: Size;
  /** Segment fill treatment — the leading segment reads as the peak marker */
  tone?: 'accent' | 'quiet';
}

/** Segmented instrument scale: encodes where a value sits inside its range. */
export const Scale: React.FC<ScaleProps> = ({ value, max = 100, size = 'md', tone = 'accent' }) => {
  const { count, className } = SEGMENTS[size];
  const filled = Math.max(0, Math.min(count, Math.round((value / max) * count)));

  return (
    <div className={className} role="img" aria-label={`${value.toFixed(1)} of ${max}`}>
      {Array.from({ length: count }).map((_, i) => {
        const isPeak = i === filled - 1;
        const on = i < filled;
        const fill = on
          ? tone === 'quiet'
            ? 'readout-tick on-strong'
            : isPeak
              ? 'readout-tick on'
              : 'readout-tick on-soft'
          : 'readout-tick';
        return <span key={i} className={fill} />;
      })}
    </div>
  );
};

interface ReadoutProps {
  label: string;
  value: number;
  max?: number;
  note?: string;
  size?: Size;
  tone?: 'accent' | 'quiet';
  /** Decimal places on the numeric read-out */
  precision?: number;
}

/** Labelled score read-out with its instrument scale underneath. */
export const Readout: React.FC<ReadoutProps> = ({
  label,
  value,
  max = 100,
  note,
  size = 'md',
  tone = 'accent',
  precision = 1,
}) => {
  const valueSize =
    size === 'lg' ? 'text-[34px] leading-none' : size === 'sm' ? 'text-[15px]' : 'text-[22px]';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3">{label}</span>
        <span className={`font-mono font-medium text-ink tnum ${valueSize}`}>
          {value.toFixed(precision)}
          <span className="text-ink-3 text-[0.62em] ml-0.5">%</span>
        </span>
      </div>
      <div className="mt-2.5">
        <Scale value={value} max={max} size={size} tone={tone} />
      </div>
      {note && <p className="text-[11px] text-ink-3 mt-2 leading-snug">{note}</p>}
    </div>
  );
};

interface ChipProps {
  label: string;
  value: number;
  max?: number;
  size?: Size;
  tone?: 'accent' | 'quiet';
}

/** Compact score chip for dense rows and indexes. */
export const ScoreChip: React.FC<ChipProps> = ({ label, value, max = 100, size = 'sm', tone = 'quiet' }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink-2 tnum">
    <span className="text-ink-3">{label}</span>
    <span className="text-ink">{value.toFixed(1)}</span>
    <span className="inline-block w-10 align-middle">
      <Scale value={value} max={max} size={size} tone={tone} />
    </span>
  </span>
);
