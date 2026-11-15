import React, { useEffect, useMemo, useState } from 'react';
import { ANALOG_SITES, PURPOSE_GROUPS } from './data/analogsData';
import { PurposeGroupId, FilterState, AnalogsViewId } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { EarthAtlasMap } from './components/map/EarthAtlasMap';
import { Theme } from './components/map/LeafletWorldMap';
import { useHashRoute } from './lib/useHashRoute';
import { PurposeGroupView } from './components/purpose/PurposeGroupView';
import { ResourcesPage } from './components/resources/ResourcesPage';
import { SearchFilterBar } from './components/filter/SearchFilterBar';
import { Compass, FlaskConical, Menu } from 'lucide-react';

const THEME_KEY = 'analog-atlas-theme';

const readInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';

  // ?theme=day|dark wins, then the saved preference, then the OS preference
  const requested = new URLSearchParams(window.location.search).get('theme');
  if (requested === 'day' || requested === 'dark') return requested;

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'day' || stored === 'dark') return stored;

  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'day' : 'dark';
};

const DEFAULT_FILTER: FilterState = {
  searchQuery: '',
  targetBody: 'All',
  purposeGroup: 'All',
  continent: 'All',
  minSiScore: 50,
};

const PROVINCE_TICK: Record<string, string> = {
  'East Asia': 'var(--azure)',
  'South Asia': 'var(--amber)',
  'South America': 'var(--emerald)',
  Antarctica: 'var(--moon)',
};

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER);
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const { route, navigate: navigateRoute } = useHashRoute(ANALOG_SITES);

  // Apply the theme to the document root so CSS variables resolve
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'day' ? 'dark' : 'day'));

  const filteredAnalogs = useMemo(
    () =>
      ANALOG_SITES.filter((site) => {
        const q = filterState.searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          site.name.toLowerCase().includes(q) ||
          site.regionName.toLowerCase().includes(q) ||
          site.country.toLowerCase().includes(q) ||
          site.targetPlanetarySite.toLowerCase().includes(q) ||
          site.terrainType.toLowerCase().includes(q) ||
          site.shortSummary.toLowerCase().includes(q);
        return (
          matchesQuery &&
          (filterState.targetBody === 'All' || site.targetBody === filterState.targetBody) &&
          (filterState.purposeGroup === 'All' || site.purposeGroup === filterState.purposeGroup) &&
          (filterState.continent === 'All' || site.continent === filterState.continent) &&
          site.siScore >= filterState.minSiScore
        );
      }),
    [filterState]
  );

  const handleNavigate = (view: AnalogsViewId, groupId?: string) => {
    setIsSidebarOpen(false);
    if (view === 'home') return navigateRoute({ name: 'home' });
    if (view === 'resources') return navigateRoute({ name: 'references' });
    return navigateRoute({
      name: 'group',
      groupId: (groupId as PurposeGroupId) ?? 'rover-mobility',
    });
  };

  const openDossier = (analogId: string) => {
    const site = ANALOG_SITES.find((s) => s.id === analogId);
    if (!site) return;
    setIsSidebarOpen(false);
    navigateRoute({ name: 'site', siteId: site.id });
  };

  // Derived view state from the URL
  const routeSite =
    route.name === 'site' ? ANALOG_SITES.find((s) => s.id === route.siteId) : undefined;

  const activeView: AnalogsViewId =
    route.name === 'home'
      ? 'home'
      : route.name === 'references'
        ? 'resources'
        : 'purpose-group';

  const activeGroupId: PurposeGroupId | null =
    route.name === 'group' ? route.groupId : routeSite ? routeSite.purposeGroup : null;

  const selectedAnalogId = route.name === 'site' ? route.siteId : undefined;

  const activeGroup = PURPOSE_GROUPS.find((g) => g.id === activeGroupId) ?? PURPOSE_GROUPS[0];
  const groupAnalogs = filteredAnalogs.filter((a) => a.purposeGroup === activeGroup.id);

  const meanEc = (filteredAnalogs.reduce((s, a) => s + a.ecScore, 0) / (filteredAnalogs.length || 1)).toFixed(1);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        activeView={activeView}
        activePurposeGroupId={activeView === 'purpose-group' ? activeGroupId : null}
        onNavigate={handleNavigate}
        onSelectSite={openDossier}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        siteCount={ANALOG_SITES.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        sites={ANALOG_SITES.map((s) => ({
          id: s.id,
          shortName: s.shortName,
          targetBody: s.targetBody,
          siScore: s.siScore,
        }))}
      />

      {/* Mobile nav trigger */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open navigation"
        className="lg:hidden fixed bottom-5 left-5 z-40 w-11 h-11 rounded-full bg-raised border border-line-strong text-ink flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="lg:pl-[264px]">
        <main className="max-w-[1140px] mx-auto px-5 sm:px-8 py-8 sm:py-10">
          {activeView === 'home' && (
            <HomeView
              filteredAnalogs={filteredAnalogs}
              selectedAnalogId={selectedAnalogId}
              onSelectAnalog={openDossier}
              onNavigateGroup={handleNavigate}
              filterState={filterState}
              onFilterChange={setFilterState}
              meanEc={meanEc}
              theme={theme}
            />
          )}

          {activeView === 'purpose-group' && (
            <PurposeGroupView
              groupData={activeGroup}
              analogs={groupAnalogs}
              selectedSite={routeSite}
              selectedAnalogId={selectedAnalogId}
              onSelectAnalog={(id) =>
                id
                  ? openDossier(id)
                  : navigateRoute({ name: 'group', groupId: activeGroup.id })
              }
            />
          )}

          {activeView === 'resources' && <ResourcesPage />}
        </main>

        <footer className="border-t border-line px-8 py-6">
          <p className="font-mono text-[10.5px] text-ink-3 max-w-[1140px] mx-auto">
            Analog Atlas — catalog v1.0 · scoring per SI / EC methodology · imagery is indicative
            field and orbital reference photography
          </p>
        </footer>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

interface HomeViewProps {
  filteredAnalogs: typeof ANALOG_SITES;
  selectedAnalogId?: string;
  onSelectAnalog: (id: string) => void;
  onNavigateGroup: (view: AnalogsViewId, groupId?: string) => void;
  filterState: FilterState;
  onFilterChange: (next: FilterState) => void;
  meanEc: string;
  theme: Theme;
}

const HomeView: React.FC<HomeViewProps> = ({
  filteredAnalogs,
  selectedAnalogId,
  onSelectAnalog,
  onNavigateGroup,
  filterState,
  onFilterChange,
  meanEc,
  theme,
}) => {
  return (
    <div className="animate-rise">
      {/* Masthead */}
      <header className="pb-8">
        <h1 className="text-[34px] sm:text-[44px] font-extrabold tracking-tight text-ink leading-[1.08]">
          Where Mars and the Moon
          <br />
          get rehearsed on Earth.
        </h1>
        <p className="mt-4 text-[15px] text-ink-2 leading-relaxed max-w-[62ch]">
          Analog Atlas catalogs eight field-proven terrestrial analogs across Antarctica, South
          Asia, East Asia and South America — each scored against its planetary target with a
          published mathematical methodology, and each honest about what Earth can&apos;t fake.
        </p>
      </header>

      {/* Filter bar */}
      <div className="mb-5">
        <SearchFilterBar
          filterState={filterState}
          onFilterChange={onFilterChange}
          totalResults={filteredAnalogs.length}
          totalCount={ANALOG_SITES.length}
        />
      </div>

      {/* Map */}
      <EarthAtlasMap
        analogs={filteredAnalogs}
        selectedAnalogId={selectedAnalogId}
        onSelectAnalog={onSelectAnalog}
        theme={theme}
      />

      {/* Purpose groups — asymmetric split */}
      <section className="mt-12">
        <h2 className="text-[17px] font-bold text-ink mb-5">Two ways to qualify a site</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {PURPOSE_GROUPS.map((group, i) => {
            const isMobility = group.id === 'rover-mobility';
            const sites = ANALOG_SITES.filter((s) => s.purposeGroup === group.id);
            const avgSi = (sites.reduce((s, a) => s + a.siScore, 0) / sites.length).toFixed(1);
            return (
              <button
                key={group.id}
                onClick={() => onNavigateGroup('purpose-group', group.id)}
                className={`text-left border border-line rounded-xl bg-surface p-6 hover:border-line-strong hover:bg-hover transition-colors group flex flex-col ${
                  i === 0 ? 'md:mr-2' : 'md:ml-2'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`p-2 rounded-lg ${
                      isMobility
                        ? 'bg-accent/12 text-mars'
                        : 'bg-azure/12 text-azure'
                    }`}
                  >
                    {isMobility ? (
                      <Compass className="w-5 h-5" />
                    ) : (
                      <FlaskConical className="w-5 h-5" />
                    )}
                  </span>
                  <span className="font-mono text-[10.5px] tracking-wide text-ink-3">
                    GROUP {isMobility ? '1' : '2'}
                  </span>
                </div>
                <h3 className="text-[18px] font-bold text-ink leading-snug">{group.title}</h3>
                <p className="mt-2 text-[13px] text-ink-2 leading-relaxed">{group.tagline}</p>

                <dl className="mt-5">
                  {group.metrics.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-baseline justify-between gap-4 py-1.5 border-t border-line"
                    >
                      <dt className="text-[12.5px] text-ink-2 leading-snug">{m.name}</dt>
                      <dd className="font-mono text-[11px] text-ink-3 whitespace-nowrap">
                        {m.weight.toFixed(2)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap gap-x-2.5 gap-y-1">
                  {sites.map((s) => (
                    <span key={s.id} className="text-[11.5px] text-ink-3">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                        style={{ backgroundColor: PROVINCE_TICK[s.continent] ?? 'rgb(var(--ink-3))' }}
                      />
                      {s.shortName}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-line flex items-baseline justify-between font-mono text-[12px]">
                  <span className="text-ink-3">mean SI</span>
                  <span className="text-[16px] text-ink font-semibold">{avgSi}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Candidate index */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[17px] font-bold text-ink">Candidate index</h2>
          <span className="font-mono text-[11.5px] text-ink-3">
            mean EC {meanEc}% across filtered sites
          </span>
        </div>

        {filteredAnalogs.length === 0 ? (
          <div className="border border-line rounded-xl bg-surface px-6 py-10 text-center">
            <p className="text-[14px] text-ink font-semibold">No sites match these filters.</p>
            <p className="text-[12.5px] text-ink-3 mt-1">
              Loosen the minimum SI or clear the search to see the full catalog again.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {filteredAnalogs.map((site) => (
              <li key={site.id}>
                <button
                  onClick={() => onSelectAnalog(site.id)}
                  className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)_auto] gap-x-6 gap-y-1 items-center py-3.5 text-left hover:bg-surface transition-colors px-2 -mx-2 rounded-lg"
                >
                  <div className="min-w-0">
                    <span className="text-[14px] font-semibold text-ink leading-snug">
                      {site.name}
                    </span>
                    <span className="block font-mono text-[10.5px] text-ink-3 mt-0.5">
                      {site.country} · {site.coordinates.display}
                    </span>
                  </div>
                  <div className="hidden sm:block text-[12.5px] text-ink-2 truncate">
                    <span
                      className={`inline-block font-mono text-[9.5px] px-1.5 py-0.5 rounded mr-2 ${
                        site.targetBody === 'Mars'
                          ? 'text-mars border border-accent/40'
                          : 'text-moon border border-moon/30'
                      }`}
                    >
                      {site.targetBody.toUpperCase()}
                    </span>
                    {site.targetPlanetarySite}
                  </div>
                  <div className="font-mono text-[12px] text-right whitespace-nowrap">
                    <span className="text-ink font-semibold">SI {site.siScore.toFixed(1)}</span>
                    <span className="text-ink-3"> · EC {site.ecScore.toFixed(1)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
