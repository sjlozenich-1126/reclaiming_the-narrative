import { ArrowLeft, FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ArticleBodyRenderer, extractArticleHeadings } from '../components/ArticleBodyRenderer';
import { EditorialImage } from '../components/EditorialImage';
import { SocialShareBar } from '../components/SocialShareBar';
import { useSeoMetadata } from '../hooks/useSeoMetadata';
import { AppRoute, JournalArticle, WayIntoArchive } from '../types/journal';

interface ArticleReaderViewProps {
  article: JournalArticle | undefined;
  allArticles: JournalArticle[];
  largeText: boolean;
  onNavigate: (route: AppRoute) => void;
}

const WAY_NAME_MAP: Record<WayIntoArchive, string> = {
  'lived-experience': '01. The Lived Experience',
  mechanisms: '02. The Mechanisms',
  'counter-archive': '03. The Counter Archive',
};

export function ArticleReaderView({
  article,
  allArticles,
  largeText,
  onNavigate,
}: ArticleReaderViewProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useSeoMetadata({
    title: article
      ? `${article.title} — Reclaiming the Narrative`
      : 'Essay Not Found — Reclaiming the Narrative',
    description: article
      ? article.abstract
      : 'Archive entry in Reclaiming the Narrative by Shane J. Lozenich.',
    image: article?.imageUrl,
    article: article || null,
  });

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [article?.id]);

  const headings = useMemo(
    () => (article ? extractArticleHeadings(article.body) : []),
    [article]
  );

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return allArticles
      .filter((a) => a.id !== article.id)
      .sort((a, b) => {
        const aMatch = a.wayIntoArchive === article.wayIntoArchive ? 1 : 0;
        const bMatch = b.wayIntoArchive === article.wayIntoArchive ? 1 : 0;
        return bMatch - aMatch;
      })
      .slice(0, 3);
  }, [article, allArticles]);

  if (!article) {
    return (
      <div className="py-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 text-center">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
          404 · Archival Reference Unavailable
        </p>
        <h1 className="font-display text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-2">
          This monograph could not be located
        </h1>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'archive', way: 'all' })}
          className="mt-6 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626]"
        >
          Return to Archive Index
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Thin Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-30 bg-transparent no-print pointer-events-none">
        <div
          className="h-full bg-[#E21B1B] dark:bg-[#F87171] transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="py-10 sm:py-14">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10">
          {/* Breadcrumb */}
          <div className="pb-5 border-b border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 flex flex-wrap items-center justify-between gap-4 no-print">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'archive', way: 'all' })}
              className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/75 dark:text-[#9D9A91] hover:text-[#E21B1B] dark:hover:text-[#F87171]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Archive Index
            </button>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] tabular-nums">
              {article.issueNumber} · {article.displayDate} · {article.readingTimeMinutes} Min Read
            </div>
          </div>

          {/* Monograph Title Block */}
          <header className="py-8 sm:py-10 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0] max-w-4xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              {WAY_NAME_MAP[article.wayIntoArchive]}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.03] tracking-[-0.02em] text-[#0A0A0A] dark:text-[#F5F4F0] mt-3 text-balance">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="mt-3 text-xl sm:text-2xl font-display italic text-[#0A0A0A]/70 dark:text-[#D4D2CC] leading-snug">
                {article.subtitle}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
              <span className="font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                By {article.authorName || 'Shane J. Lozenich'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{article.displayDate}</span>
              {article.tags.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.tags.join(' / ')}</span>
                </>
              )}
            </div>
          </header>

          {/* 70% Reading Body / 30% Sticky Margin Rail */}
          <div className="pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Main Essay Column */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <EditorialImage
                  src={article.imageUrl}
                  alt={article.title}
                  aspectClassName="aspect-[16/10]"
                  caption={article.imageCaption}
                />
              </div>

              {/* Abstract Box */}
              <div className="mb-8 p-5 sm:p-6 border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513]">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] mb-2">
                  Abstract
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-[#0A0A0A]/85 dark:text-[#D4D2CC]">
                  {article.abstract}
                </p>
              </div>

              {/* Essay Body */}
              <ArticleBodyRenderer body={article.body} largeText={largeText} />

              {/* Conclusion & Social Share */}
              <div className="mt-12 pt-8 border-t border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 space-y-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                  Circulate &amp; Cite This Monograph
                </p>
                <SocialShareBar title={article.title} summary={article.abstract} />
              </div>
            </div>

            {/* Sticky Margin Rail */}
            <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-8 no-print">
              {/* Accession Metadata Table */}
              <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] pb-3 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
                  Folio Specification
                </p>
                <dl className="divide-y divide-[#0A0A0A]/15 dark:divide-[#F5F4F0]/15 text-xs">
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">Author</dt>
                    <dd className="font-semibold text-right text-[#0A0A0A] dark:text-[#F5F4F0]">
                      {article.authorName || 'Shane J. Lozenich'}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">Track</dt>
                    <dd className="font-medium text-right text-[#0A0A0A] dark:text-[#F5F4F0]">
                      {WAY_NAME_MAP[article.wayIntoArchive]}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">Issue</dt>
                    <dd className="font-mono tabular-nums text-right text-[#0A0A0A] dark:text-[#F5F4F0]">
                      {article.issueNumber}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">Published</dt>
                    <dd className="text-right text-[#0A0A0A] dark:text-[#F5F4F0]">
                      {article.displayDate}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">Length</dt>
                    <dd className="font-mono tabular-nums text-right text-[#0A0A0A] dark:text-[#F5F4F0]">
                      {article.readingTimeMinutes} minutes
                    </dd>
                  </div>
                </dl>

                {article.sourceDocumentUrl && (
                  <div className="pt-4 mt-2 border-t border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15">
                    <a
                      href={article.sourceDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#E21B1B] hover:border-[#E21B1B] hover:text-white dark:hover:bg-[#DC2626] dark:hover:border-[#DC2626] transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Open Primary Source PDF
                    </a>
                  </div>
                )}
              </div>

              {/* Section Outline */}
              {headings.length > 0 && (
                <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-5">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] dark:text-[#F5F4F0] pb-3 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
                    Sections in This Essay
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="block text-[#0A0A0A]/75 dark:text-[#D4D2CC] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:underline underline-offset-4 leading-snug"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Taxonomy Links */}
              {article.tags.length > 0 && (
                <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-5">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] dark:text-[#F5F4F0] pb-3 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
                    Indexed Taxonomy
                  </p>
                  <div className="mt-3 flex flex-col items-start gap-1">
                    {article.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onNavigate({ view: 'archive', way: 'all', tag })}
                        className="text-left py-1 text-xs font-medium text-[#0A0A0A]/70 dark:text-[#D4D2CC] hover:text-[#E21B1B] dark:hover:text-[#F87171] hover:font-bold transition-colors"
                      >
                        → {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Related Monographs */}
          {relatedArticles.length > 0 && (
            <section className="mt-16 pt-10 border-t-2 border-[#0A0A0A] dark:border-[#F5F4F0] no-print">
              <h2 className="font-display text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mb-6">
                Further Reading in the Corpus
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    className="border-t border-[#0A0A0A] dark:border-[#F5F4F0] pt-5 flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
                        {rel.issueNumber}
                      </p>
                      <h3 className="font-display text-2xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-2 leading-[1.1]">
                        <button
                          type="button"
                          onClick={() => onNavigate({ view: 'article', slug: rel.slug })}
                          className="text-left hover:text-[#E21B1B] dark:hover:text-[#F87171] transition-colors"
                        >
                          {rel.title}
                        </button>
                      </h3>
                      <p className="mt-2.5 text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] line-clamp-3">
                        {rel.abstract}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate({ view: 'article', slug: rel.slug })}
                      className="mt-5 self-start px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors"
                    >
                      Read Monograph
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
