import { FileText, Mail } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { SocialShareBar } from '../components/SocialShareBar';
import { AUTHOR_PROFILE } from '../data/landingContent';
import { AppRoute, JournalArticle } from '../types/journal';

interface AboutViewProps {
  articles: JournalArticle[];
  onNavigate: (route: AppRoute) => void;
}

export function AboutView({ articles, onNavigate }: AboutViewProps) {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 space-y-14">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-12 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
          <div className="lg:col-span-5">
            <EditorialImage
              src={AUTHOR_PROFILE.studyImage}
              alt="Open manuscript journal, fountain pen, and archival sealed dossier"
              aspectClassName="aspect-square"
              caption="Archival manuscript folio and primary documentary seal."
            />
          </div>

          <div className="lg:col-span-7 space-y-5">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Author &amp; Principal Archivist
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[4rem] font-bold leading-none tracking-[-0.02em] text-[#0A0A0A] dark:text-[#F5F4F0]">
              {AUTHOR_PROFILE.name}
            </h1>
            <p className="text-xl font-display italic text-[#0A0A0A]/70 dark:text-[#D4D2CC]">
              {AUTHOR_PROFILE.role} · {AUTHOR_PROFILE.location}
            </p>
            <p className="text-base sm:text-[17px] leading-[1.75] text-[#0A0A0A]/85 dark:text-[#D4D2CC] max-w-prose">
              {AUTHOR_PROFILE.bio}
            </p>
            <p className="text-base sm:text-[17px] leading-[1.75] text-[#0A0A0A]/85 dark:text-[#D4D2CC] max-w-prose">
              Through <em>Reclaiming the Narrative</em>, {AUTHOR_PROFILE.name} brings together primary legal dockets, clinical laboratory records, social network topology, and psychoanalytic theory—demonstrating how individuals subjected to epistemic invalidation can transform raw documentation into a coherent, publicly legible counter-archive.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${AUTHOR_PROFILE.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Author
              </a>
              <a
                href={AUTHOR_PROFILE.sourceManifestoPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Download Manifesto PDF
              </a>
            </div>

            <div className="pt-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/65 dark:text-[#9D9A91] mb-2.5">
                Share This Journal
              </p>
              <SocialShareBar
                title="Reclaiming the Narrative"
                summary="Essays and empirical monographs by Shane J. Lozenich on epistemic violence, the bureaucratic unconscious, and counter-archival coherence."
              />
            </div>
          </div>
        </section>

        {/* Complete Bibliography */}
        <section className="space-y-6">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Archival Bibliography
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-1">
              Published Works by {AUTHOR_PROFILE.name}
            </h2>
          </div>

          <div className="divide-y divide-[#0A0A0A]/20 dark:divide-[#F5F4F0]/20 border-y border-[#0A0A0A] dark:border-[#F5F4F0]">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] tabular-nums text-[#0A0A0A]/65 dark:text-[#9D9A91]">
                    {String(index + 1).padStart(2, '0')} · {article.issueNumber} · {article.displayDate}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-0.5">
                    <button
                      type="button"
                      onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                      className="text-left hover:text-[#E21B1B] dark:hover:text-[#F87171] transition-colors"
                    >
                      {article.title}
                    </button>
                  </h3>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {article.sourceDocumentUrl && (
                    <a
                      href={article.sourceDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#0A0A0A]/70 dark:text-[#9D9A91] hover:underline underline-offset-4"
                    >
                      PDF
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                    className="px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors"
                  >
                    Read Monograph
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
