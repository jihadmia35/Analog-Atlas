import { ANALOG_SITES } from '../data/analogsData';
import type { AnalogSite } from '../types';

/* ------------------------------------------------------------------ */
/* Dossier imagery prefetching                                         */
/*                                                                     */
/* Dossier images are large and only used on the site pages, so they   */
/* are not fetched at boot. Instead the browser cache is warmed:       */
/* every site pair is requested once the main UI is idle, and a site's */
/* pair is requested the moment its catalog card is hovered or         */
/* focused — so the dossier opens with imagery already decoded.        */
/* ------------------------------------------------------------------ */

const prefetched = new Set<string>();

export const prefetchImage = (src: string): void => {
  if (!src || prefetched.has(src)) return;
  prefetched.add(src);
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
};

export const prefetchSiteImages = (site: Pick<AnalogSite, 'heroImage' | 'targetImage'>): void => {
  prefetchImage(site.heroImage);
  prefetchImage(site.targetImage);
};

/**
 * Warm the cache with every site pair once the app goes idle, staggered
 * so the trickle never competes with the first render or user input.
 */
export const prefetchAllSiteImages = (): void => {
  const run = () => {
    ANALOG_SITES.forEach((site, i) => {
      window.setTimeout(() => prefetchSiteImages(site), i * 400);
    });
  };
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
    .requestIdleCallback;
  if (typeof idle === 'function') {
    idle(run, { timeout: 4000 });
  } else {
    window.setTimeout(run, 1500);
  }
};
