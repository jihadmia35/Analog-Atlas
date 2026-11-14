import { useCallback, useEffect, useState } from 'react';
import { AnalogSite, PurposeGroupId } from '../types';

export type Route =
  | { name: 'home' }
  | { name: 'group'; groupId: PurposeGroupId }
  | { name: 'site'; siteId: string }
  | { name: 'references' };

const routeToHash = (route: Route): string => {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'group':
      return route.groupId === 'rover-mobility' ? '#/mobility' : '#/science';
    case 'site':
      return `#/site/${route.siteId}`;
    case 'references':
      return '#/references';
  }
};

const hashToRoute = (hash: string, sites: AnalogSite[]): Route => {
  const path = hash.replace(/^#\/?/, '');

  if (path.startsWith('site/')) {
    const siteId = path.slice(5);
    const site = sites.find((s) => s.id === siteId);
    if (site) return { name: 'site', siteId };
  }
  if (path.startsWith('mobility')) return { name: 'group', groupId: 'rover-mobility' };
  if (path.startsWith('science')) return { name: 'group', groupId: 'surface-science' };
  if (path.startsWith('references')) return { name: 'references' };
  return { name: 'home' };
};

/** Keeps the current screen in the URL hash so views can be linked and restored. */
export const useHashRoute = (sites: AnalogSite[]) => {
  const [route, setRoute] = useState<Route>(() =>
    hashToRoute(window.location.hash, sites)
  );

  useEffect(() => {
    const onHashChange = () => setRoute(hashToRoute(window.location.hash, sites));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [sites]);

  const navigate = useCallback((next: Route) => {
    const hash = routeToHash(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setRoute(next);
    window.scrollTo({ top: 0 });
  }, []);

  return { route, navigate };
};
