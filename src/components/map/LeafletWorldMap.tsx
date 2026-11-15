import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AnalogSite } from '../../types';

export type Theme = 'day' | 'dark';

interface LeafletWorldMapProps {
  analogs: AnalogSite[];
  selectedAnalogId?: string;
  onSelectAnalog: (id: string) => void;
  theme: Theme;
}

const BODY_COLOR: Record<string, { core: string; label: string }> = {
  Mars: { core: 'rgb(var(--mars))', label: 'rgb(var(--mars))' },
  Moon: { core: 'rgb(var(--moon))', label: 'rgb(var(--moon))' },
};

/** Region outlines for the four analog provinces, per theme */
const PROVINCES: Array<{
  name: string;
  sites: string;
  points: [number, number][];
  colors: Record<Theme, { stroke: string; fill: string }>;
}> = [
  {
    name: 'East Asia',
    sites: 'Qaidam Basin · Miyake-jima',
    points: [
      [52.0, 72.0], [52.0, 146.0], [18.0, 146.0], [18.0, 72.0],
    ],
    colors: {
      day: { stroke: '#195CBA', fill: '#195CBA' },
      dark: { stroke: '#388BFD', fill: '#1F6FEB' },
    },
  },
  {
    name: 'South Asia',
    sites: 'Chandragup I · Sittampundi · Baratang',
    points: [
      [38.0, 60.0], [38.0, 97.0], [5.0, 97.0], [5.0, 66.0],
    ],
    colors: {
      day: { stroke: '#8A6100', fill: '#8A6100' },
      dark: { stroke: '#D29922', fill: '#9E6A03' },
    },
  },
  {
    name: 'South America',
    sites: 'Puna',
    points: [
      [-16.0, -72.0], [-16.0, -61.0], [-40.0, -61.0], [-40.0, -72.0],
    ],
    colors: {
      day: { stroke: '#187236', fill: '#187236' },
      dark: { stroke: '#3FB950', fill: '#238636' },
    },
  },
  {
    name: 'Antarctica',
    sites: 'Beacon Valley',
    points: [
      [-63.0, 130.0], [-63.0, 180.0], [-84.0, 180.0], [-84.0, 130.0],
    ],
    colors: {
      day: { stroke: '#545E6C', fill: '#545E6C' },
      dark: { stroke: '#C9D1D9', fill: '#6E7A88' },
    },
  },
];

/**
 * One detailed reference basemap serves both themes; the night palette is
 * produced by inverting the tiles in CSS (see index.css), which keeps borders
 * and place labels legible at every zoom level.
 */
const BASE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';

const ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a> &mdash; Esri, Maxar, Earthstar Geographics, GIS User Community';

export const LeafletWorldMap: React.FC<LeafletWorldMapProps> = ({
  analogs,
  selectedAnalogId,
  onSelectAnalog,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const zoomControlRef = useRef<L.Control.Zoom | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const polygonsRef = useRef<L.Polygon[]>([]);
  const hasFramedRef = useRef(false);
  const onSelectRef = useRef(onSelectAnalog);
  onSelectRef.current = onSelectAnalog;

  // Initialize once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [34, 4],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 0.8,
      worldCopyJump: true,
      fadeAnimation: false,
    });

    const zoomControl = L.control.zoom({ position: 'topright' }).addTo(map);
    zoomControlRef.current = zoomControl;

    // On narrow screens the zoom control moves out of the way of the pins
    const placeZoomControl = () => {
      zoomControl.setPosition(window.innerWidth < 640 ? 'bottomleft' : 'topright');
    };
    placeZoomControl();
    window.addEventListener('resize', placeZoomControl);

    const attribution = L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);
    attribution.addAttribution(ATTRIBUTION);

    baseLayerRef.current = L.tileLayer(BASE_TILE_URL, { maxZoom: 16, minZoom: 0 }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      window.removeEventListener('resize', placeZoomControl);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Theme: swap basemap and province outlines
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !baseLayerRef.current) return;

    // The basemap itself is theme-agnostic (CSS handles the palette swap).

    polygonsRef.current.forEach((poly, i) => {
      const c = PROVINCES[i].colors[theme];
      poly.setStyle({ color: c.stroke, fillColor: c.fill });
      const tip = poly.getTooltip();
      if (tip) {
        tip.setContent(
          `<strong style="color:${c.stroke}">${PROVINCES[i].name}</strong><br/>${PROVINCES[i].sites}`
        );
      }
    });
  }, [theme]);

  // Provinces (created once, restyled by the theme effect)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    polygonsRef.current = PROVINCES.map((p) => {
      const c = p.colors.dark;
      const poly = L.polygon(p.points, {
        color: c.stroke,
        weight: 1.2,
        fillColor: c.fill,
        fillOpacity: 0.12,
        dashArray: '5, 6',
        interactive: true,
      });
      poly.bindTooltip(
        `<strong style="color:${c.stroke}">${p.name}</strong><br/>${p.sites}`,
        { sticky: true, className: 'analog-province-tooltip' }
      );
      poly.addTo(map);
      return poly;
    });
  }, []);

  // Sync markers
  useEffect(() => {
    const layer = markersRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;

    layer.clearLayers();

    // Frame the whole catalog on first load (once), then respect the user's view
    if (!hasFramedRef.current && analogs.length > 0) {
      const bounds = L.latLngBounds(analogs.map((s) => [s.coordinates.lat, s.coordinates.lng]));
      const narrow = window.innerWidth < 640;
      map.fitBounds(bounds, {
        padding: narrow ? [18, 28] : [70, 70],
        // A narrow viewport can't fit the full catalog span at zoom 3 —
        // cap the frame so every pin starts on screen.
        maxZoom: narrow ? 2 : 3,
        animate: false,
      });
      hasFramedRef.current = true;
    }

    // Greedy label placement: project each site to screen space and pick the
    // first candidate offset that does not collide with an already-placed label.
    const placed: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const LABEL_W = 104;
    const LABEL_H = 18;
    const CANDIDATES: Array<{ dx: number; dy: number; anchor: 'left' | 'right' }> = [
      { dx: 26, dy: 0, anchor: 'left' },
      { dx: 26, dy: -24, anchor: 'left' },
      { dx: 26, dy: 22, anchor: 'left' },
      { dx: -26, dy: 0, anchor: 'right' },
      { dx: -26, dy: -24, anchor: 'right' },
      { dx: -26, dy: 22, anchor: 'right' },
    ];

    const projected = analogs
      .map((site) => ({
        site,
        point: map.latLngToContainerPoint([site.coordinates.lat, site.coordinates.lng]),
      }))
      .sort((a, b) => b.point.y - a.point.y);

    projected.forEach(({ site, point }) => {
      let chosen = CANDIDATES[0];
      let box = null as null | { x1: number; y1: number; x2: number; y2: number };

      for (const candidate of CANDIDATES) {
        const x1 =
          candidate.anchor === 'left'
            ? point.x + candidate.dx
            : point.x + candidate.dx - LABEL_W;
        const y1 = point.y + candidate.dy - LABEL_H / 2;
        const candidateBox = { x1, y1, x2: x1 + LABEL_W, y2: y1 + LABEL_H };
        const collides = placed.some(
          (p) =>
            !(
              candidateBox.x2 < p.x1 ||
              candidateBox.x1 > p.x2 ||
              candidateBox.y2 < p.y1 ||
              candidateBox.y1 > p.y2
            )
        );
        if (!collides) {
          chosen = candidate;
          box = candidateBox;
          break;
        }
      }

      if (!box) {
        const x1 = point.x + chosen.dx;
        const y1 = point.y + chosen.dy - LABEL_H / 2;
        box = { x1, y1, x2: x1 + LABEL_W, y2: y1 + LABEL_H };
      }
      placed.push(box);

      const isSelected = site.id === selectedAnalogId;
      const colors = BODY_COLOR[site.targetBody] ?? BODY_COLOR.Mars;
      const labelStyle =
        chosen.anchor === 'left'
          ? `left:${chosen.dx}px;top:${chosen.dy}px;transform:translateY(-50%)`
          : `right:${-chosen.dx}px;top:${chosen.dy}px;transform:translateY(-50%)`;

      const icon = L.divIcon({
        className: `analog-pin${isSelected ? ' is-selected' : ''}`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        html: `
          <div class="pin-shell" style="--pin-color:${colors.core}">
            ${isSelected ? '<span class="pin-ring"></span>' : ''}
            <span class="pin-dot"><span class="pin-core"></span></span>
            <span class="pin-label" style="${labelStyle}">${site.shortName}<span class="pin-body"> · ${site.targetBody}</span></span>
          </div>
        `,
      });

      const marker = L.marker([site.coordinates.lat, site.coordinates.lng], {
        icon,
        title: site.name,
        riseOnHover: true,
      });

      const popupHtml = `
        <div class="atlas-popup">
          <div class="popup-eyebrow">${site.regionName.toUpperCase()}, ${site.country.toUpperCase()}</div>
          <div class="popup-title">${site.name}</div>
          <div class="popup-target">Target · ${site.targetPlanetarySite}</div>
          <div class="popup-scores">
            <span>EC <strong style="color:${colors.core}">${site.ecScore.toFixed(1)}%</strong></span>
            <span>SI <strong style="color:${colors.core}">${site.siScore.toFixed(1)}%</strong></span>
          </div>
          <button data-open-dossier="${site.id}" class="popup-open">Open dossier</button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280, minWidth: 280 });
      marker.on('popupopen', () => {
        const btn = document.querySelector(`[data-open-dossier="${site.id}"]`);
        if (btn) {
          btn.addEventListener('click', () => {
            onSelectRef.current(site.id);
            marker.closePopup();
          });
        }
      });

      layer.addLayer(marker);
    });

    if (selectedAnalogId) {
      const site = analogs.find((s) => s.id === selectedAnalogId);
      if (site) {
        map.flyTo(
          [site.coordinates.lat, site.coordinates.lng],
          window.innerWidth < 640 ? 4 : 5,
          { duration: 1.1 }
        );
      }
    }
  }, [analogs, selectedAnalogId]);

  return (
    <div className="relative w-full h-[440px] sm:h-[540px] rounded-panel overflow-hidden border border-line shadow-panel">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Instrument framing: graticule + vignette over the basemap */}
      <div className="map-veil" />

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[500] bg-surface/90 backdrop-blur-md border border-line rounded-[10px] px-3.5 py-3 hidden sm:block shadow-panel">
        <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3 mb-2">Map key</div>
        <div className="space-y-1.5 text-[11.5px] text-ink-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full border border-mars bg-mars" />
            Mars-target sites
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full border border-moon bg-moon" />
            Moon-target sites
          </div>
          <div className="pt-1.5 mt-1 border-t border-line font-mono text-[10px] text-ink-3">
            dashed outlines · source provinces
          </div>
        </div>
      </div>
    </div>
  );
};
