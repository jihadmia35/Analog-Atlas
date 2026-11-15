import React from 'react';
import { AnalogsViewId, PurposeGroupId } from '../../types';
import { Compass, FlaskConical, BookOpen, Map, X, Sun, Moon } from 'lucide-react';
import { Theme } from '../map/LeafletWorldMap';

interface SidebarProps {
  activeView: AnalogsViewId;
  activePurposeGroupId: string | null;
  onNavigate: (view: AnalogsViewId, groupId?: string) => void;
  onSelectSite: (siteId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  siteCount: number;
  theme: Theme;
  onToggleTheme: () => void;
  sites: Array<{
    id: string;
    shortName: string;
    targetBody: string;
    siScore: number;
    purposeGroup: PurposeGroupId;
  }>;
  activeSiteId?: string;
}

const NAV_ITEMS: Array<{
  view: AnalogsViewId;
  groupId?: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  tickColor: string;
}> = [
  {
    view: 'home',
    label: 'Atlas overview',
    hint: 'All sites on one map',
    icon: <Map className="w-4 h-4" />,
    tickColor: 'transparent',
  },
  {
    view: 'purpose-group',
    groupId: 'rover-mobility',
    label: 'Rover mobility',
    hint: 'Group 1 · terramechanics',
    icon: <Compass className="w-4 h-4" />,
    tickColor: 'var(--accent)',
  },
  {
    view: 'purpose-group',
    groupId: 'surface-science',
    label: 'Surface science',
    hint: 'Group 2 · geochemistry',
    icon: <FlaskConical className="w-4 h-4" />,
    tickColor: 'var(--azure)',
  },
  {
    view: 'resources',
    label: 'References',
    hint: 'Bibliography & datasets',
    icon: <BookOpen className="w-4 h-4" />,
    tickColor: 'transparent',
  },
];

const GROUP_LABELS: Record<PurposeGroupId, string> = {
  'rover-mobility': 'Rover mobility',
  'surface-science': 'Surface science',
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  activePurposeGroupId,
  onNavigate,
  onSelectSite,
  isOpen,
  onClose,
  siteCount,
  theme,
  onToggleTheme,
  sites,
  activeSiteId,
}) => {
  const body = (
    <div className="flex flex-col h-full">
      {/* Wordmark */}
      <button
        onClick={() => onNavigate('home')}
        className="text-left px-6 pt-7 pb-6 border-b border-line w-full hover:bg-hover transition-colors group"
      >
        <span className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-[7px] border border-accent/40 bg-accent/12 flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-accent" />
          </span>
          <span className="text-[19px] font-bold tracking-tight text-ink leading-none">
            Analog<span className="text-accent"> Atlas</span>
          </span>
        </span>
        <span className="block mt-2.5 text-[11px] text-ink-3 leading-snug">
          Earth candidates for Mars &amp; Lunar mission verification
        </span>
      </button>

      <nav className="flex-1 px-3 pt-5 space-y-0.5 overflow-y-auto" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.view === activeView &&
            (item.view !== 'purpose-group' || item.groupId === activePurposeGroupId);

          return (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view, item.groupId);
                if (isOpen) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive ? 'bg-raised text-ink shadow-panel' : 'text-ink-2 hover:text-ink hover:bg-hover'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="w-[2px] self-stretch rounded-full transition-colors"
                style={{
                  backgroundColor: isActive
                    ? item.tickColor === 'transparent'
                      ? 'var(--accent)'
                      : item.tickColor
                    : 'transparent',
                }}
              />
              <span className={isActive ? 'text-ink' : 'text-ink-3'}>
                {item.icon}
              </span>
              <span className="flex flex-col">
                <span className="text-[13px] font-medium leading-tight">{item.label}</span>
                <span className="text-[10.5px] text-ink-3 leading-tight mt-0.5">{item.hint}</span>
              </span>
            </button>
          );
        })}

        {/* Site index */}
        <div className="px-3 pt-7">
          <div className="px-3 pb-2 font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase">
            Catalog sites
          </div>

          {(['rover-mobility', 'surface-science'] as PurposeGroupId[]).map((groupId) => {
            const groupSites = sites.filter((s) => s.purposeGroup === groupId);
            if (groupSites.length === 0) return null;

            return (
              <div key={groupId} className="mb-4">
                <div className="px-3 pb-1.5 text-[10px] tracking-wide text-ink-3/80">{GROUP_LABELS[groupId]}</div>
                <ul className="space-y-px">
                  {groupSites.map((site) => {
                    const isOpen = site.id === activeSiteId;
                    return (
                      <li key={site.id}>
                        <button
                          onClick={() => {
                            onSelectSite(site.id);
                            if (isOpen) onClose();
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-md text-left transition-colors group ${
                            isOpen ? 'bg-raised shadow-panel' : 'hover:bg-hover'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              site.targetBody === 'Mars' ? 'bg-mars' : 'bg-moon'
                            }`}
                          />
                          <span
                            className={`text-[12px] truncate transition-colors ${
                              isOpen
                                ? 'text-ink font-medium'
                                : 'text-ink-2 group-hover:text-ink'
                            }`}
                          >
                            {site.shortName}
                          </span>
                          <span className="ml-auto flex items-center gap-2 shrink-0">
                            <span className="font-mono text-[10.5px] text-ink-3 tnum">
                              {site.siScore.toFixed(1)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Theme switch */}
      <button
        onClick={onToggleTheme}
        className="mx-4 mb-3 flex items-center gap-2.5 rounded-lg border border-line bg-canvas px-3 py-2 text-[12.5px] text-ink-2 hover:text-ink hover:border-line-strong transition-colors"
        aria-label={`Switch to ${theme === 'day' ? 'night' : 'day'} view`}
      >
        {theme === 'day' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        <span className="font-medium">{theme === 'day' ? 'Night view' : 'Day view'}</span>
      </button>

      {/* Catalog status */}
      <div className="px-6 py-5 border-t border-line font-mono text-[10.5px] text-ink-3 space-y-1.5">
        <div className="flex justify-between">
          <span>Catalog</span>
          <span className="text-ink-2">v1.0 · {siteCount} sites</span>
        </div>
        <div className="flex justify-between">
          <span>Provinces</span>
          <span className="text-ink-2">4 regions</span>
        </div>
        <div className="flex justify-between">
          <span>Targets</span>
          <span className="text-ink-2">Mars · Moon</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[264px] border-r border-line bg-surface z-40">
        {body}
      </aside>

      {/* Mobile slide-over */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <aside
          className={`absolute inset-y-0 left-0 w-[280px] bg-surface border-r border-line transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="absolute top-4 right-4 p-2 text-ink-3 hover:text-ink"
          >
            <X className="w-5 h-5" />
          </button>
          {body}
        </aside>
      </div>
    </>
  );
};
