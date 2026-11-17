import { AppRoute } from '../types/journal';

interface SiteFooterProps {
  onNavigate: (route: AppRoute) => void;
  onOpenSettings: () => void;
}

export function SiteFooter({ onNavigate, onOpenSettings }: SiteFooterProps) {
  return (
    <footer className="border-t-4 border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] py-10 sm:py-12 no-print">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#0A0A0A]/20 dark:border-[#F5F4F0]/20">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] dark:text-[#F5F4F0]">
              Reclaiming the Narrative
            </p>
            <p className="mt-2.5 text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed max-w-md">
              An independent psychology newspaper and research archive examining epistemic violence, the bureaucratic unconscious, and counter-archival coherence by <strong>Shane J. Lozenich</strong>.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Sections
            </p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="#/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({ view: 'home' });
                  }}
                  className="text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  Overview &amp; Manifesto
                </a>
              </li>
              <li>
                <a
                  href="#/archive"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({ view: 'archive', way: 'all' });
                  }}
                  className="text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  Archive Index
                </a>
              </li>
              <li>
                <a
                  href="#/methodology"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({ view: 'methodology' });
                  }}
                  className="text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  Research Methodology
                </a>
              </li>
              <li>
                <a
                  href="#/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({ view: 'about' });
                  }}
                  className="text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  About Shane J. Lozenich
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Correspondence &amp; Channels
            </p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="mailto:jscthebrand@gmail.com"
                  className="text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  jscthebrand@gmail.com
                </a>
              </li>
              <li>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Reclaiming the Narrative — Journal of Psychology & Institutional Systems by Shane J. Lozenich')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  Share on X / Twitter
                </a>
              </li>
              <li>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A0A0A] dark:text-[#F5F4F0] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  Share on LinkedIn
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="text-[#0A0A0A]/75 dark:text-[#9D9A91] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4"
                >
                  Reader Settings &amp; Editorial Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/60 dark:text-[#9D9A91]">
          <p>© {new Date().getFullYear()} Shane J. Lozenich — Independent Research Archive</p>
          <p>Seattle / King County · Counter-Archival Edition</p>
        </div>
      </div>
    </footer>
  );
}
