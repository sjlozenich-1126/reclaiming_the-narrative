import { ArrowRight, BookOpen, FileText } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import {
  AUTHOR_PROFILE,
  LANDING_MANIFESTO,
  THREE_WAYS_INTO_ARCHIVE,
} from '../data/landingContent';
import { AppRoute, JournalArticle, WayIntoArchive } from '../types/journal';

interface HomeViewProps {
  articles: JournalArticle[];
  onNavigate: (route: AppRoute) => void;
}

const WAY_LABEL_MAP: Record<WayIntoArchive, string> = {
  'lived-experience': '01 · The Lived Experience',
  mechanisms: '02 · The Mechanisms',
  'counter-archive': '03 · The Counter Archive',
};

export function HomeView({ articles, onNavigate }: HomeViewProps) {
  const leadArticle = articles.find((a) => a.featured) || articles[0];
  const secondaryArticles = articles
    .filter((a) => a.id !== leadArticle?.id)
    .slice(0, 3);
  const indexArticles = articles.filter(
    (a) => a.id !== leadArticle?.id && !secondaryArticles.some((s) => s.id === a.id)
  );

  return (
    <div>
      {/* 1. Broadsheet Lead Story & Manifesto */}
      <section className="border-b-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] py-10 sm:py-14 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
                  {LANDING_MANIFESTO.kicker}
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[4.25rem] font-bold leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] dark:text-[#F5F4F0] mt-3 text-balance">
                  {LANDING_MANIFESTO.title}
                </h1>
                <p className="mt-4 text-xl sm:text-2xl font-display italic text-[#0A0A0A]/70 dark:text-[#D4D2CC] leading-snug max-w-2xl">
                  {LANDING_MANIFESTO.subtitle}
                </p>

                <div className="mt-5 pt-4 border-t border-[#0A0A0A]/20 dark:border-[#F5F4F0]/20 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                  <span className="font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                    By {AUTHOR_PROFILE.name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Psychology &amp; Institutional Systems</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums text-[#E21B1B] dark:text-[#F87171] font-bold">
                    {articles.length} Dispatches Archived
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-base sm:text-[17px] leading-[1.75] text-[#0A0A0A]/85 dark:text-[#D4D2CC] max-w-2xl">
                  {LANDING_MANIFESTO.openingParagraphs.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? 'editorial-drop-cap' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#0A0A0A]/20 dark:border-[#F5F4F0]/20 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'archive', way: 'all' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  Enter Archive Index
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'methodology' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0"
                >
                  Audit Methodology
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <a
                  href={AUTHOR_PROFILE.sourceManifestoPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#0A0A0A]/75 dark:text-[#9D9A91] hover:text-[#E21B1B] dark:hover:text-[#F87171] underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  Source PDF
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <div className="flex-1 flex flex-col">
                <EditorialImage
                  src={AUTHOR_PROFILE.heroImage}
                  alt="Archival desk with bound legal dockets, fountain pen, and research manuscripts"
                  aspectClassName="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[280px]"
                  className="flex-1"
                  caption="Plate I — Evidentiary preservation desk: restoring narrative thickness against institutional flattening."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Foundational Thesis */}
      <section className="border-b-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] py-14 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 lg:border-r lg:border-[#0A0A0A]/20 dark:lg:border-[#F5F4F0]/20 lg:pr-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Foundational Thesis
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-[#0A0A0A] dark:text-[#F5F4F0] mt-2 text-balance">
              Epistemic Trauma &amp; the Attack on Linking
            </h2>
            <p className="mt-3 text-sm text-[#0A0A0A]/70 dark:text-[#9D9A91] leading-relaxed">
              Before exploring empirical docket audits and statutory models, this dossier establishes the psychological reality at the center of the record.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-10">
            {LANDING_MANIFESTO.sections.map((section) => (
              <article key={section.id} className="space-y-4">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                  {section.heading}
                </h3>
                <div className="space-y-4 text-base sm:text-[17px] leading-[1.75] text-[#0A0A0A]/85 dark:text-[#D4D2CC] max-w-prose">
                  {section.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
                {section.pullQuote && (
                  <blockquote className="my-6 py-5 border-y-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] font-display italic text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F4F0] leading-snug">
                    “{section.pullQuote}”
                  </blockquote>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Three Ways into the Archive */}
      <section className="border-b-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] py-14 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
                Curatorial Architecture
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-1">
                Three Ways into the Archive
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'archive', way: 'all' })}
              className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#E21B1B] dark:text-[#F87171] hover:underline underline-offset-4 whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              View Complete Index →
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {THREE_WAYS_INTO_ARCHIVE.map((way) => {
              const count = articles.filter((a) => a.wayIntoArchive === way.id).length;
              return (
                <button
                  key={way.id}
                  type="button"
                  onClick={() => onNavigate({ view: 'archive', way: way.id })}
                  className="group text-left border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-6 flex flex-col justify-between hover:border-[#E21B1B] dark:hover:border-[#F87171] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/65 dark:text-[#9D9A91] tabular-nums">
                      <span className="text-[#E21B1B] dark:text-[#F87171]">TRACK {way.index}</span>
                      <span>{count} {count === 1 ? 'ESSAY' : 'ESSAYS'}</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-3 group-hover:text-[#E21B1B] dark:group-hover:text-[#F87171] transition-colors">
                      {way.label}
                    </h3>
                    <p className="font-mono text-[11px] text-[#0A0A0A]/65 dark:text-[#9D9A91] mt-1.5">
                      {way.subtitle}
                    </p>
                    <p className="mt-4 text-sm text-[#0A0A0A]/80 dark:text-[#D4D2CC] leading-relaxed">
                      {way.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 flex items-center justify-between gap-2 font-mono text-[11px] text-[#0A0A0A]/65 dark:text-[#9D9A91]">
                    <span className="truncate">{way.keyThemes.join(' · ')}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-[#E21B1B] dark:text-[#F87171] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Broadsheet 3-Tier Front Page Edition */}
      <section className="py-14 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
                Front Page Edition
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-1">
                From the Journal &amp; Case Corpus
              </h2>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
              Authored by {AUTHOR_PROFILE.name}
            </p>
          </div>

          {/* Tier 1: Lead Monograph */}
          {leadArticle && (
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-10 border-b border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25">
              <div className="lg:col-span-6">
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'article', slug: leadArticle.slug })}
                  className="block w-full text-left h-full"
                >
                  <EditorialImage
                    src={leadArticle.imageUrl}
                    alt={leadArticle.title}
                    aspectClassName="aspect-[4/3] lg:h-full min-h-[260px]"
                    className="h-full"
                  />
                </button>
              </div>
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] tabular-nums">
                    <span>{leadArticle.issueNumber} · {WAY_LABEL_MAP[leadArticle.wayIntoArchive]}</span>
                    <span>{leadArticle.readingTimeMinutes} Min Read</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.05] text-[#0A0A0A] dark:text-[#F5F4F0] mt-3 text-balance">
                    <button
                      type="button"
                      onClick={() => onNavigate({ view: 'article', slug: leadArticle.slug })}
                      className="text-left hover:text-[#E21B1B] dark:hover:text-[#F87171] transition-colors"
                    >
                      {leadArticle.title}
                    </button>
                  </h3>
                  <p className="mt-2.5 text-lg font-display italic text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                    {leadArticle.subtitle}
                  </p>
                  <p className="mt-4 text-sm sm:text-base text-[#0A0A0A]/80 dark:text-[#D4D2CC] leading-relaxed">
                    {leadArticle.abstract}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0A0A0A]/20 dark:border-[#F5F4F0]/20 flex flex-wrap items-center justify-between gap-4">
                  <div className="font-mono text-[11px] text-[#0A0A0A]/65 dark:text-[#9D9A91]">
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">By {leadArticle.authorName}</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>{leadArticle.displayDate}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ view: 'article', slug: leadArticle.slug })}
                    className="px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0"
                  >
                    Read Monograph
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Tier 2: Secondary Research Features */}
          {secondaryArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pb-10 border-b border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25">
              {secondaryArticles.map((article) => (
                <article
                  key={article.id}
                  className="border-t border-[#0A0A0A] dark:border-[#F5F4F0] pt-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] tabular-nums mb-3">
                      <span>{article.issueNumber}</span>
                      <span>{article.readingTimeMinutes} Min Read</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                      className="block w-full text-left mb-4"
                    >
                      <EditorialImage
                        src={article.imageUrl}
                        alt={article.title}
                        aspectClassName="aspect-[4/3]"
                      />
                    </button>
                    <h3 className="font-display text-2xl font-bold leading-[1.1] text-[#0A0A0A] dark:text-[#F5F4F0] text-balance">
                      <button
                        type="button"
                        onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                        className="text-left hover:text-[#E21B1B] dark:hover:text-[#F87171] transition-colors"
                      >
                        {article.title}
                      </button>
                    </h3>
                    <p className="mt-3 text-sm text-[#0A0A0A]/80 dark:text-[#D4D2CC] leading-relaxed line-clamp-3">
                      {article.abstract}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">
                      {article.displayDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                      className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0"
                    >
                      Read Monograph
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Tier 3: Archival Dispatch Rows */}
          {indexArticles.length > 0 && (
            <div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] mb-4">
                Additional Dispatches in the Corpus
              </h3>
              <div className="divide-y divide-[#0A0A0A]/20 dark:divide-[#F5F4F0]/20 border-y border-[#0A0A0A] dark:border-[#F5F4F0]">
                {indexArticles.map((article) => (
                  <div
                    key={article.id}
                    className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/65 dark:text-[#9D9A91] tabular-nums">
                        <span className="text-[#E21B1B] dark:text-[#F87171]">{article.issueNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{WAY_LABEL_MAP[article.wayIntoArchive]}</span>
                        {article.tags.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{article.tags.slice(0, 3).join(' / ')}</span>
                          </>
                        )}
                      </div>
                      <h4 className="font-display text-2xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-1">
                        <button
                          type="button"
                          onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                          className="text-left hover:text-[#E21B1B] dark:hover:text-[#F87171] transition-colors"
                        >
                          {article.title}
                        </button>
                      </h4>
                      <p className="mt-1 text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] line-clamp-2">
                        {article.abstract}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#0A0A0A]/60 dark:text-[#9D9A91] tabular-nums">
                        {article.readingTimeMinutes} min
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                        className="px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
                      >
                        Read Monograph
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
