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
  const [earthLoaded, setEarthLoaded] = useState(false);
  const [targetLoaded, setTargetLoaded] = useState(false);

  // Sources already decoded in this session — revisiting a dossier must not
  // flash the skeleton for imagery the browser still has in memory.
  const loadedCache = useRef<Set<string>>(new Set());

  // The slider instance is reused when moving between dossiers, so both
  // layers have to be torn down here: clear the loaded flag first so the
  // previous site's imagery drops out at once (over the network the old
  // <img> would otherwise keep rendering until the next file finishes
  // downloading), then swap the sources.
  useEffect(() => {
    setEarthLoaded(loadedCache.current.has(earthImage));
    setTargetLoaded(loadedCache.current.has(targetImage));
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
  const streamingIn = !earthLoaded || !targetLoaded;
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
          onLoad={() => {
            loadedCache.current.add(targetSrc);
            setTargetLoaded(true);
          }}
          onError={() => setTargetSrc(FALLBACK_TARGET_SVG)}
          className={`img-fade absolute inset-0 w-full h-full object-cover ${
            targetLoaded ? 'is-loaded' : ''
          }`}
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
            onLoad={() => {
              loadedCache.current.add(earthSrc);
              setEarthLoaded(true);
            }}
            onError={() => setEarthSrc(FALLBACK_EARTH_SVG)}
            className={`img-fade absolute inset-0 w-full h-full object-cover ${
              earthLoaded ? 'is-loaded' : ''
            }`}
            draggable={false}
          />
        </div>

        {/* Loading skeleton — covers the frame while either side streams in */}
        {streamingIn && (
          <div
            className="absolute inset-0 z-20 pointer-events-none skeleton-shimmer"
            aria-hidden="true"
          >
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.14em] uppercase text-ink-3 animate-pulse">
              Loading imagery…
            </span>
          </div>
        )}

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-ink/70" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/95 backdrop-blur-sm border border-line-strong flex items-center justify-center shadow-panel-lg transition-transform duration-200 hover:scale-110">
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
