import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EditorialImage } from '../components/EditorialImage';
import { AppRoute, JournalArticle, JournalTag, WayIntoArchive } from '../types/journal';

interface ArchiveViewProps {
  articles: JournalArticle[];
  tags: JournalTag[];
  initialWay?: WayIntoArchive | 'all';
  initialTag?: string;
  onNavigate: (route: AppRoute) => void;
}

const TRACK_FILTERS: { id: WayIntoArchive | 'all'; label: string }[] = [
  { id: 'all', label: '00. All Archive' },
  { id: 'lived-experience', label: '01. The Lived Experience' },
  { id: 'mechanisms', label: '02. The Mechanisms' },
  { id: 'counter-archive', label: '03. The Counter Archive' },
];

export function ArchiveView({
  articles,
  tags,
  initialWay = 'all',
  initialTag = '',
  onNavigate,
}: ArchiveViewProps) {
  const [activeWay, setActiveWay] = useState<WayIntoArchive | 'all'>(initialWay);
  const [activeTag, setActiveTag] = useState<string>(initialTag);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      if (activeWay !== 'all' && article.wayIntoArchive !== activeWay) return false;
      if (activeTag && !article.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())) {
        return false;
      }
      if (q) {
        const hay = [
          article.title,
          article.subtitle,
          article.abstract,
          article.authorName,
          ...article.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [articles, activeWay, activeTag, searchQuery]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10">
      <div className="flex flex-col lg:flex-row">
        {/* Variation 10 Left Broadsheet Index Sidebar */}
        <aside className="lg:w-[280px] shrink-0 py-8 lg:py-10 lg:pr-8 lg:border-r-[1.5px] border-b-[1.5px] lg:border-b-0 border-[#0A0A0A] dark:border-[#F5F4F0] lg:bg-gradient-to-r lg:from-transparent lg:to-black/[0.02] dark:lg:to-white/[0.02]">
          <div className="space-y-8">
            <section>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] dark:text-[#F5F4F0] border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0] pb-2 mb-3">
                Entry Track
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-x-4 gap-y-0.5">
                {TRACK_FILTERS.map((track) => {
                  const isActive = activeWay === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setActiveWay(track.id)}
                      className={`text-left py-1.5 text-xs transition-opacity ${
                        isActive
                          ? 'opacity-100 font-bold text-[#E21B1B] dark:text-[#F87171]'
                          : 'opacity-65 text-[#0A0A0A] dark:text-[#F5F4F0] hover:opacity-100 hover:text-[#E21B1B] dark:hover:text-[#F87171]'
                      }`}
                    >
                      {track.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] dark:text-[#F5F4F0] border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0] pb-2 mb-3">
                Taxonomy
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-x-4 gap-y-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTag('')}
                  className={`text-left py-1.5 text-xs transition-opacity ${
                    activeTag === ''
                      ? 'opacity-100 font-bold text-[#E21B1B] dark:text-[#F87171]'
                      : 'opacity-65 text-[#0A0A0A] dark:text-[#F5F4F0] hover:opacity-100 hover:text-[#E21B1B] dark:hover:text-[#F87171]'
                  }`}
                >
                  All Topics
                </button>
                {tags.map((tag) => {
                  const isActive = activeTag.toLowerCase() === tag.name.toLowerCase();
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setActiveTag((prev) => (prev === tag.name ? '' : tag.name))}
                      className={`text-left py-1.5 text-xs transition-opacity ${
                        isActive
                          ? 'opacity-100 font-bold text-[#E21B1B] dark:text-[#F87171]'
                          : 'opacity-65 text-[#0A0A0A] dark:text-[#F5F4F0] hover:opacity-100 hover:text-[#E21B1B] dark:hover:text-[#F87171]'
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </aside>

        {/* Right Article Stream */}
        <section className="flex-1 min-w-0 py-8 lg:py-10 lg:pl-10 space-y-10">
          {/* Hero Banner */}
          <header className="border-b border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 pb-8 space-y-5">
            <div>
              <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] mb-3">
                Institutional Repository
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[4.25rem] font-bold leading-none tracking-[-0.02em] text-[#0A0A0A] dark:text-[#F5F4F0] text-balance">
                The Counter-Archive Index
              </h1>
              <p className="mt-4 font-display italic text-xl sm:text-2xl text-[#0A0A0A]/65 dark:text-[#D4D2CC] max-w-3xl leading-snug">
                Browse all published essays, empirical docket frameworks, and psychoanalytic analyses by Shane J. Lozenich. Testing institutional indicators across municipal &amp; county legal dockets.
              </p>
            </div>

            {/* Search & Document Count Strip */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80 border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 bg-white dark:bg-[#151513]">
                <Search className="w-4 h-4 text-[#0A0A0A]/55 dark:text-[#9D9A91] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search archive entries..."
                  aria-label="Search archive essays"
                  className="w-full pl-9 pr-8 py-2 text-xs bg-transparent text-[#0A0A0A] dark:text-[#F5F4F0] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#0A0A0A]/60 dark:text-[#9D9A91]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/70 dark:text-[#9D9A91] tabular-nums">
                <span>
                  {String(filteredArticles.length).padStart(2, '0')} of {String(articles.length).padStart(2, '0')} Entries Documented
                </span>
                {(activeWay !== 'all' || activeTag || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWay('all');
                      setActiveTag('');
                      setSearchQuery('');
                    }}
                    className="text-[#E21B1B] dark:text-[#F87171] underline underline-offset-4"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* 2-Column Broadsheet Article Feed */}
          {filteredArticles.length === 0 ? (
            <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-12 text-center">
              <h2 className="font-display text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                No matching monographs found
              </h2>
              <p className="mt-2 text-sm text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                Try clearing your active taxonomy filter or broadening your search terms.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveWay('all');
                  setActiveTag('');
                  setSearchQuery('');
                }}
                className="mt-5 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 lg:gap-12">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="border-t border-[#0A0A0A] dark:border-[#F5F4F0] pt-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] tabular-nums">
                      <span>{article.issueNumber}</span>
                      <span>{article.readingTimeMinutes} Min Read</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                      className="block w-full text-left mb-5"
                    >
                      <EditorialImage
                        src={article.imageUrl}
                        alt={article.title}
                        aspectClassName="aspect-[16/10]"
                      />
                    </button>

                    <h2 className="font-display text-3xl font-bold leading-[1.08] text-[#0A0A0A] dark:text-[#F5F4F0] mb-4 text-balance">
                      <button
                        type="button"
                        onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                        className="text-left hover:text-[#E21B1B] dark:hover:text-[#F87171] transition-colors"
                      >
                        {article.title}
                      </button>
                    </h2>

                    <p className="text-[15px] leading-[1.65] text-[#0A0A0A]/80 dark:text-[#D4D2CC] mb-5 line-clamp-4">
                      {article.abstract}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 flex flex-wrap items-center justify-between gap-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#0A0A0A]/65 dark:text-[#9D9A91] truncate max-w-[260px]">
                      <span className="font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">{article.authorName}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{article.displayDate}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                      className="px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0"
                    >
                      Read Monograph
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
