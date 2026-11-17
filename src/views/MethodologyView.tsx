import { ArrowRight } from 'lucide-react';
import { AppRoute } from '../types/journal';

interface MethodologyViewProps {
  onNavigate: (route: AppRoute) => void;
}

export function MethodologyView({ onNavigate }: MethodologyViewProps) {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 space-y-14">
        <header className="pb-8 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0] max-w-4xl">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
            Empirical &amp; Psychoanalytic Protocol
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.02] tracking-[-0.02em] text-[#0A0A0A] dark:text-[#F5F4F0] mt-2 text-balance">
            Audit Methodology &amp; Counter-Archival Architecture
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed">
            Developed by <strong>Shane J. Lozenich</strong>, this methodology formalizes how qualitative legal-medical records are audited for epistemic violence, institutional defense cycles, and public-versus-operational memory discrepancies.
          </p>
        </header>

        {/* Quantitative Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-t-2 border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] border-x border-b border-x-[#0A0A0A]/20 border-b-[#0A0A0A]/20 dark:border-x-[#F5F4F0]/20 dark:border-b-[#F5F4F0]/20 p-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Systemic Discrepancy Index
            </p>
            <p className="font-mono text-3xl font-bold tabular-nums text-[#0A0A0A] dark:text-[#F5F4F0] mt-3">
              D̄ = 89.75 / 100
            </p>
            <p className="mt-3 text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed">
              Measures operational deviation between formal 4th, 5th, 6th, and 14th Amendment guarantees and administrative execution across target dockets (Control baseline ≤ 30.0).
            </p>
          </div>

          <div className="border-t-2 border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] border-x border-b border-x-[#0A0A0A]/20 border-b-[#0A0A0A]/20 dark:border-x-[#F5F4F0]/20 dark:border-b-[#F5F4F0]/20 p-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Legal Volume Formula
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#0A0A0A] dark:text-[#F5F4F0] mt-3">
              V = W × D × Z
            </p>
            <p className="mt-3 text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed">
              Containment forces the Z-axis (uncompressible forensic bedrock) toward zero. Reclaiming sovereignty re-inflates Z through raw logs, lab panels, and certified clerk dockets.
            </p>
          </div>

          <div className="border-t-2 border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] border-x border-b border-x-[#0A0A0A]/20 border-b-[#0A0A0A]/20 dark:border-x-[#F5F4F0]/20 dark:border-b-[#F5F4F0]/20 p-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Network Asymmetry
            </p>
            <p className="font-mono text-3xl font-bold tabular-nums text-[#0A0A0A] dark:text-[#F5F4F0] mt-3">
              Outdegree ≈ 0
            </p>
            <p className="mt-3 text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed">
              Receiving institutional nodes absorb and reclassify citizen complaints without returning reparative feedback—the structural signature of the paranoid-schizoid position.
            </p>
          </div>
        </section>

        {/* Dual-Track Parallel Review Standard */}
        <section className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
                Structural Remediation Standard
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-1">
                The Parallel Review Framework
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'article', slug: 'the-parallel-review-framework' })}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#E21B1B] dark:text-[#F87171] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Read Full Policy Paper
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 bg-[#F8F7F4] dark:bg-[#0C0C0B] p-5 space-y-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                Track A · Clinical &amp; Safety Track
              </p>
              <ul className="space-y-2 text-sm text-[#0A0A0A]/85 dark:text-[#D4D2CC] list-disc pl-5 leading-relaxed">
                <li>Assesses immediate medical safety, physical trauma, and voluntary care needs.</li>
                <li>Evaluates functional courtroom capacity under the <em>Dusky</em> standard without imposing diagnosis.</li>
                <li><strong>Strict Boundary</strong>: Prohibited from suspending <em>Brady</em> discovery or tolling CrR 3.3 speedy-trial clocks.</li>
              </ul>
            </div>

            <div className="border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 bg-[#F8F7F4] dark:bg-[#0C0C0B] p-5 space-y-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                Track B · Evidentiary &amp; Technical Track
              </p>
              <ul className="space-y-2 text-sm text-[#0A0A0A]/85 dark:text-[#D4D2CC] list-disc pl-5 leading-relaxed">
                <li>Preserves physical devices under Fourth Amendment warrant protocols (<em>Riley v. California</em>).</li>
                <li>Examines server traceroutes, network security logs, and chain-of-custody files independently.</li>
                <li><strong>Strict Boundary</strong>: Must issue written factual determinations; inability to verify technical claims cannot be cited as mental illness.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Memory Discrepancy Model */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Stage 2 Forensic Protocol
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-2 text-balance">
              Memory Discrepancy Auditing
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed">
              Comparing public-facing state web portals against certified internal county clerk records collapses the concealed decision architecture using only the institution’s own primary documentation.
            </p>
            <button
              type="button"
              onClick={() =>
                onNavigate({
                  view: 'article',
                  slug: 'whoever-controls-the-memory-controls-the-meaning',
                })
              }
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors"
            >
              Read “Whoever Controls the Memory” →
            </button>
          </div>

          <div className="lg:col-span-7 border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-[#F1EFEA] dark:bg-[#1C1C19] p-6 font-mono text-xs sm:text-sm space-y-4">
            <div className="p-4 border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 bg-white dark:bg-[#151513]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/60 dark:text-[#9D9A91]">
                [PUBLIC STATE PORTAL — PUBLIC MEMORY]
              </p>
              <p className="mt-1 font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                “Archived — No Docket Info, Cause: n/a” (Conceals operational activity)
              </p>
            </div>
            <div className="text-center text-xs text-[#0A0A0A]/65 dark:text-[#9D9A91]" aria-hidden="true">
              ↓ Juxtaposed on identical case number &amp; date
            </div>
            <div className="p-4 border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 bg-white dark:bg-[#151513]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/60 dark:text-[#9D9A91]">
                [COUNTY CLERK DOCKET — OPERATIONAL MEMORY]
              </p>
              <p className="mt-1 font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                “Active · 60+ Hearings · Competency Loops · Absorbed Trial Dates”
              </p>
            </div>
            <div className="text-center text-xs text-[#0A0A0A]/65 dark:text-[#9D9A91]" aria-hidden="true">
              ↓ Result
            </div>
            <div className="p-4 border-2 border-[#E21B1B] dark:border-[#F87171] bg-white dark:bg-[#151513]">
              <p className="text-[#E21B1B] dark:text-[#F87171] font-bold">
                [THE COUNTER-ARCHIVE] — Proves structural opacity without external speculation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
