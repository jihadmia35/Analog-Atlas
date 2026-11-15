import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageComparisonSliderProps {
  earthImage: string;
  targetImage: string;
  earthCaption: string;
  targetCaption: string;
  targetBody: 'Mars' | 'Moon';
  className?: string;
}

const FALLBACK_EARTH_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="%23161B22"/><text x="40" y="250" fill="%238B949E" font-family="monospace" font-size="18">Earth analog imagery unavailable</text></svg>`;

const FALLBACK_TARGET_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="%232A1612"/><text x="40" y="250" fill="%23EEB1A1" font-family="monospace" font-size="18">Planetary target imagery unavailable</text></svg>`;

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  earthImage,
  targetImage,
  earthCaption,
  targetCaption,
  targetBody,
  className = '',
}) => {
  const [position, setPosition] = useState(50);
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [earthSrc, setEarthSrc] = useState(earthImage);
  const [targetSrc, setTargetSrc] = useState(targetImage);

  // The slider instance is reused when moving between dossiers, so the
  // compared pair has to be re-synced whenever the site changes.
  useEffect(() => {
    setEarthSrc(earthImage);
    setTargetSrc(targetImage);
  }, [earthImage, targetImage]);

  const moveTo = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(2, Math.min(98, pct)));
  }, []);

  const startDrag = () => {
    draggingRef.current = true;
  };
  const endDrag = () => {
    draggingRef.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (draggingRef.current) moveTo(e.clientX);
  };

  const targetLabel = targetBody === 'Mars' ? 'Mars target' : 'Lunar target';
  return (
    <figure className={className}>
      <div
        ref={containerRef}
        className="relative w-full h-[300px] sm:h-[430px] rounded-panel overflow-hidden border border-line bg-surface select-none touch-none cursor-ew-resize shadow-panel"
        onPointerDown={startDrag}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerMove={onPointerMove}
      >
        {/* Planetary target fills the frame */}
        <img
          src={targetSrc}
          alt={targetCaption}
          loading="eager"
          onError={() => setTargetSrc(FALLBACK_TARGET_SVG)}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Earth analog clipped from the left */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={earthSrc}
            alt={earthCaption}
            loading="eager"
            onError={() => setEarthSrc(FALLBACK_EARTH_SVG)}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-ink/70" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/95 backdrop-blur-sm border border-line-strong flex items-center justify-center shadow-panel-lg">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
            </svg>
          </div>
        </div>

        {/* Corner tags */}
        <span className="absolute top-3 left-3 z-10 font-mono text-[10px] tracking-[0.06em] px-2 py-1 rounded-[7px] bg-canvas/80 backdrop-blur-sm border border-emerald/40 text-emerald">
          Earth · {position.toFixed(0)}%
        </span>
        <span className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-[0.06em] px-2 py-1 rounded-[7px] bg-canvas/80 backdrop-blur-sm border border-accent/40 text-mars">
          {targetBody} · {(100 - position).toFixed(0)}%
        </span>
      </div>

      {/* Captions */}
      <figcaption className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 text-[12px] leading-relaxed">
        <p className="text-ink-2">
          <span className="text-emerald font-mono text-[10px] tracking-[0.08em] uppercase block mb-1">
            Earth analog
          </span>
          {earthCaption}
        </p>
        <p className="text-ink-2">
          <span className="text-mars font-mono text-[10px] tracking-[0.08em] uppercase block mb-1">
            {targetLabel}
          </span>
          {targetCaption}
        </p>
      </figcaption>
    </figure>
  );
};
