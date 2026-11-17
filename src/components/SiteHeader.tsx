import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AppRoute } from '../types/journal';

interface SiteHeaderProps {
  route: AppRoute;
  isAdminSignedIn: boolean;
  onNavigate: (route: AppRoute) => void;
  onOpenSettings: () => void;
  onScrollToNewsletter: () => void;
}

export function SiteHeader({
  route,
  isAdminSignedIn,
  onNavigate,
  onOpenSettings,
  onScrollToNewsletter,
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (active: boolean) =>
    `whitespace-nowrap shrink-0 text-xs font-bold uppercase tracking-[0.06em] transition-colors duration-150 ${
      active
        ? 'text-[#E21B1B] dark:text-[#F87171]'
        : 'text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171]'
    }`;

  const navigateAndClose = (nextRoute: AppRoute) => {
    setMobileOpen(false);
    onNavigate(nextRoute);
  };

  return (
    <header className="bg-[#F8F7F4] dark:bg-[#0C0C0B] border-b-4 border-[#0A0A0A] dark:border-[#F5F4F0] no-print">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 pt-5 sm:pt-7">
        {/* Broadsheet Edition Meta Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 items-center pb-2.5 border-b-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] dark:text-[#F5F4F0] tabular-nums">
          <span>Volume I — No. 004</span>
          <span className="hidden sm:block text-center">Seattle / King County / Washington</span>
          <span className="text-right">Updated Nov 2026</span>
        </div>

        {/* Monumental Newspaper Masthead */}
        <div className="py-5 sm:py-7 text-center">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigateAndClose({ view: 'home' });
            }}
            className="inline-block font-display font-bold uppercase tracking-[-0.04em] leading-[0.88] text-[clamp(2.25rem,6.5vw,5.5rem)] text-[#0A0A0A] dark:text-[#F5F4F0] hover:opacity-90 transition-opacity text-balance"
          >
            Reclaiming the Narrative
          </a>
          <p className="font-mono text-[11px] sm:text-xs text-[#0A0A0A]/70 dark:text-[#F5F4F0]/70 max-w-xl mx-auto mt-3 leading-relaxed">
            A Journal of Psychology &amp; Institutional Systems by Shane J. Lozenich. Examining clinical triage, memory infrastructure, and administrative power.
          </p>
        </div>

        {/* 3-Zone Navigation Bar */}
        <div className="border-t border-[#0A0A0A] dark:border-[#F5F4F0] py-3 flex items-center justify-between gap-8">
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary Navigation">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigateAndClose({ view: 'home' });
              }}
              className={navLinkClass(route.view === 'home')}
            >
              Overview
            </a>
            <a
              href="#/archive"
              onClick={(e) => {
                e.preventDefault();
                navigateAndClose({ view: 'archive', way: 'all' });
              }}
              className={navLinkClass(route.view === 'archive' || route.view === 'article')}
            >
              Archive Index
            </a>
            <a
              href="#/methodology"
              onClick={(e) => {
                e.preventDefault();
                navigateAndClose({ view: 'methodology' });
              }}
              className={navLinkClass(route.view === 'methodology')}
            >
              Methodology
            </a>
            <a
              href="#/about"
              onClick={(e) => {
                e.preventDefault();
                navigateAndClose({ view: 'about' });
              }}
              className={navLinkClass(route.view === 'about')}
            >
              About
            </a>
            <button
              type="button"
              onClick={onOpenSettings}
              className={navLinkClass(false)}
            >
              Settings
            </button>
          </nav>

          {/* Mobile Section Label */}
          <span className="md:hidden font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] dark:text-[#F5F4F0]">
            Broadsheet Navigation
          </span>

          {/* Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {isAdminSignedIn ? (
              <button
                type="button"
                onClick={() => navigateAndClose({ view: 'admin' })}
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0"
              >
                Editorial Desk
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onScrollToNewsletter();
                }}
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0"
              >
                Subscribe
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#0A0A0A] dark:text-[#F5F4F0] border border-[#0A0A0A] dark:border-[#F5F4F0]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513]">
          <nav className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile Navigation">
            <button
              type="button"
              onClick={() => navigateAndClose({ view: 'home' })}
              className="text-left px-3 py-3 text-sm font-bold uppercase tracking-[0.06em] border-b border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 text-[#0A0A0A] dark:text-[#F5F4F0]"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => navigateAndClose({ view: 'archive', way: 'all' })}
              className="text-left px-3 py-3 text-sm font-bold uppercase tracking-[0.06em] border-b border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 text-[#0A0A0A] dark:text-[#F5F4F0]"
            >
              Archive Index
            </button>
            <button
              type="button"
              onClick={() => navigateAndClose({ view: 'methodology' })}
              className="text-left px-3 py-3 text-sm font-bold uppercase tracking-[0.06em] border-b border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 text-[#0A0A0A] dark:text-[#F5F4F0]"
            >
              Methodology
            </button>
            <button
              type="button"
              onClick={() => navigateAndClose({ view: 'about' })}
              className="text-left px-3 py-3 text-sm font-bold uppercase tracking-[0.06em] border-b border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 text-[#0A0A0A] dark:text-[#F5F4F0]"
            >
              About Shane J. Lozenich
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenSettings();
              }}
              className="text-left px-3 py-3 text-sm font-bold uppercase tracking-[0.06em] border-b border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 text-[#0A0A0A] dark:text-[#F5F4F0]"
            >
              Settings &amp; Dark Mode
            </button>
            <div className="pt-3 flex items-center gap-3">
              {isAdminSignedIn ? (
                <button
                  type="button"
                  onClick={() => navigateAndClose({ view: 'admin' })}
                  className="flex-1 py-3 px-4 font-mono text-xs font-bold uppercase tracking-[0.1em] bg-[#E21B1B] text-white dark:bg-[#DC2626]"
                >
                  Open Editorial Desk
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onScrollToNewsletter();
                  }}
                  className="flex-1 py-3 px-4 font-mono text-xs font-bold uppercase tracking-[0.1em] bg-[#E21B1B] text-white dark:bg-[#DC2626]"
                >
                  Subscribe to Dispatches
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
