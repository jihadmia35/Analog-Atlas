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
import { Readout, ScoreChip } from './components/Readout';
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
  'East Asia': 'rgb(var(--azure))',
  'South Asia': 'rgb(var(--amber))',
  'South America': 'rgb(var(--emerald))',
  Antarctica: 'rgb(var(--moon))',
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

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'day' : 'dark'));

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
        activeSiteId={selectedAnalogId}
        sites={ANALOG_SITES.map((s) => ({
          id: s.id,
          shortName: s.shortName,
          targetBody: s.targetBody,
          siScore: s.siScore,
          purposeGroup: s.purposeGroup,
        }))}
      />

      {/* Mobile nav trigger */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open navigation"
        className="lg:hidden fixed bottom-5 left-5 z-40 w-11 h-11 rounded-full bg-raised border border-line-strong text-ink flex items-center justify-center shadow-panel-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="lg:pl-[264px]">
        <main className="max-w-[1140px] mx-auto px-5 sm:px-8 py-8 sm:py-10 pb-24 lg:pb-10">
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

        <footer className="border-t border-line px-8 py-7">
          <div className="max-w-[1140px] mx-auto flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <p className="font-mono text-[10.5px] text-ink-3">
              Analog Atlas · catalog v1.0 · scores follow the published SI / EC methodology
            </p>
            <p className="font-mono text-[10.5px] text-ink-3/80">
              Imagery is field and orbital reference photography
            </p>
          </div>
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
  const siRange = filteredAnalogs.length
    ? {
        min: Math.min(...filteredAnalogs.map((a) => a.siScore)),
        max: Math.max(...filteredAnalogs.map((a) => a.siScore)),
      }
    : { min: 0, max: 0 };

  const stats: Array<{ value: string; label: string }> = [
    { value: String(filteredAnalogs.length), label: 'analogs listed' },
    { value: '4', label: 'source provinces' },
    { value: '2', label: 'target bodies' },
    { value: `${siRange.min.toFixed(1)}–${siRange.max.toFixed(1)}`, label: 'similarity index' },
  ];

  return (
    <div>
      {/* Masthead */}
      <header className="grid-paper panel overflow-hidden mb-8 animate-rise">
        <div className="px-6 sm:px-9 pt-9 sm:pt-12 pb-8">
          <h1 className="text-[clamp(30px,5.4vw,52px)] font-bold tracking-[-0.035em] text-ink leading-[1.03] max-w-[21ch]">
            Where Mars and the Moon get rehearsed on Earth.
          </h1>
          <p className="mt-5 text-[15px] text-ink-2 leading-relaxed max-w-[64ch]">
            Eight field-proven terrestrial analogs across Antarctica, South Asia, East Asia and
            South America. Every reading is taken from the published site dossiers, scored against
            its planetary target with the characteristic metric matrix, and published with the
            disclosures of what Earth cannot fake.
          </p>
        </div>

        {/* Stat strip */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 border-t border-line stagger">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 sm:px-9 py-5 ${
                i > 0 ? 'sm:border-l sm:border-line' : ''
              } ${i % 2 === 1 ? 'border-l border-line' : ''} ${
                i >= 2 ? 'border-t border-line sm:border-t-0' : ''
              }`}
            >
              <dt className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3">
                {s.label}
              </dt>
              <dd className="mt-1.5 font-mono text-[20px] font-medium text-ink tnum">{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Filter bar */}
      <div className="mb-6 fade-in" style={{ animationDelay: '0.12s' }}>
        <SearchFilterBar
          filterState={filterState}
          onFilterChange={onFilterChange}
          totalResults={filteredAnalogs.length}
          totalCount={ANALOG_SITES.length}
        />
      </div>

      {/* Map */}
      <div className="fade-in" style={{ animationDelay: '0.2s' }}>
        <EarthAtlasMap
          analogs={filteredAnalogs}
          selectedAnalogId={selectedAnalogId}
          onSelectAnalog={onSelectAnalog}
          theme={theme}
        />
      </div>

      {/* Purpose groups — asymmetric split */}
      <section className="mt-14 fade-in" style={{ animationDelay: '0.28s' }}>
        <div className="flex items-baseline justify-between gap-6 mb-5">
          <h2 className="text-[17px] font-semibold text-ink">Two ways to qualify a site</h2>
          <p className="font-mono text-[10.5px] text-ink-3 hidden sm:block">mean SI computed across each group</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {PURPOSE_GROUPS.map((group, i) => {
            const isMobility = group.id === 'rover-mobility';
            const sites = ANALOG_SITES.filter((s) => s.purposeGroup === group.id);
            const avgSi = sites.reduce((s, a) => s + a.siScore, 0) / sites.length;
            return (
              <button
                key={group.id}
                onClick={() => onNavigateGroup('purpose-group', group.id)}
                className={`text-left panel panel-lift press overflow-hidden flex flex-col group ${
                  i === 0 ? 'md:mr-2' : 'md:ml-2'
                }`}
              >
                <div className="px-6 pt-6 pb-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`p-2 rounded-[10px] transition-transform duration-300 ${
                        isMobility ? 'bg-accent/12 text-mars' : 'bg-azure/12 text-azure'
                      } group-hover:scale-110`}
                    >
                      {isMobility ? (
                        <Compass className="w-[18px] h-[18px]" />
                      ) : (
                        <FlaskConical className="w-[18px] h-[18px]" />
                      )}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3">
                      Group {isMobility ? '1' : '2'}
                    </span>
                  </div>
                  <h3 className="text-[19px] font-semibold text-ink leading-snug tracking-[-0.01em]">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-ink-2 leading-relaxed">{group.tagline}</p>
                </div>

                <dl className="px-6">
                  {group.metrics.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-baseline justify-between gap-4 py-2 border-t border-line"
                    >
                      <dt className="text-[12.5px] text-ink-2 leading-snug">{m.name}</dt>
                      <dd className="font-mono text-[11px] text-ink-3 tnum whitespace-nowrap">
                        {m.weight.toFixed(2)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="px-6 pt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                  {sites.map((s) => (
                    <span key={s.id} className="text-[11.5px] text-ink-3 inline-flex items-center gap-1.5">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: PROVINCE_TICK[s.continent] ?? 'rgb(var(--ink-3))' }}
                      />
                      {s.shortName}
                    </span>
                  ))}
                </div>

                <div className="px-6 pt-5 pb-6 mt-5 border-t border-line">
                  <Readout
                    label="Mean similarity index"
                    value={avgSi}
                    size="md"
                    note={`${sites.length} analogs · ${group.scoringModel.name}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Candidate index */}
      <section className="mt-14 fade-in" style={{ animationDelay: '0.34s' }}>
        <div className="flex items-baseline justify-between gap-6 mb-5">
          <h2 className="text-[17px] font-semibold text-ink">Candidate index</h2>
          <span className="font-mono text-[11.5px] text-ink-3 tnum">
            mean EC {meanEc}% across filtered sites
          </span>
        </div>

        {filteredAnalogs.length === 0 ? (
          <div className="panel px-6 py-12 text-center">
            <p className="text-[14px] text-ink font-medium">No sites match these filters.</p>
            <p className="text-[12.5px] text-ink-3 mt-1">
              Lower the minimum similarity index or clear the search to see the full catalog.
            </p>
          </div>
        ) : (
          <ul className="panel divide-y divide-line overflow-hidden">
            {filteredAnalogs.map((site) => (
              <li key={site.id}>
                <button
                  onClick={() => onSelectAnalog(site.id)}
                  className="w-full grid grid-cols-1 sm:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)_auto] gap-x-6 gap-y-2 items-center py-4 px-5 text-left hover:bg-hover transition-colors duration-150 press"
                >
                  <div className="min-w-0">
                    <span className="text-[14px] font-medium text-ink leading-snug transition-colors duration-150">
                      {site.name}
                    </span>
                    <span className="block font-mono text-[10.5px] text-ink-3 mt-1 tnum">
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
                  <div className="flex items-center gap-5 justify-between sm:justify-end sm:justify-self-end">
                    <ScoreChip label="SI" value={site.siScore} />
                    <span className="font-mono text-[11.5px] text-ink-3 tnum w-16 text-right whitespace-nowrap">
                      EC {site.ecScore.toFixed(1)}
                    </span>
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
