import { CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { subscribeToNewsletter } from '../lib/journalService';
import { NewsletterFrequency } from '../types/journal';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<NewsletterFrequency>('all');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setStatus('idle');
    setErrorMessage('');
    try {
      await subscribeToNewsletter(trimmed, name, frequency);
      setStatus('success');
      setEmail('');
      setName('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error && err.message.includes('permission')
          ? 'Subscription could not be recorded right now. Please try again shortly.'
          : 'Unable to complete subscription. Please verify your email and retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="newsletter-dispatch"
      className="border-t-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] bg-[#F1EFEA] dark:bg-[#1C1C19] py-14 sm:py-16 no-print"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171] mb-2">
            The Dispatch Circular
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-[#0A0A0A] dark:text-[#F5F4F0] text-balance">
            Receive new psychology dispatches &amp; archive briefings
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed">
            Subscribe for direct correspondence from <strong>Shane J. Lozenich</strong> whenever new docket audits, psychoanalytic essays, and counter-archive investigations publish.
          </p>
        </div>

        <div className="lg:col-span-7">
          {status === 'success' ? (
            <div className="border-[1.5px] border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] p-6 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#E21B1B] dark:text-[#F87171] mt-0.5 shrink-0" />
              <div>
                <h3 className="font-display text-2xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                  Subscription recorded in the circular
                </h3>
                <p className="text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] mt-1">
                  Thank you for joining the readership of <em>Reclaiming the Narrative</em>. You will receive future issues according to your chosen cadence.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] underline underline-offset-4 text-[#E21B1B] dark:text-[#F87171]"
                >
                  Register another address
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] p-5 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="newsletter-name"
                    className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5"
                  >
                    Name (Optional)
                  </label>
                  <input
                    id="newsletter-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Reader or affiliation"
                    maxLength={120}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7F4] dark:bg-[#0C0C0B] border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 text-[#0A0A0A] dark:text-[#F5F4F0] focus:outline-none focus:border-[#E21B1B] dark:focus:border-[#F87171]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reader@institution.org"
                    maxLength={200}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7F4] dark:bg-[#0C0C0B] border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 text-[#0A0A0A] dark:text-[#F5F4F0] focus:outline-none focus:border-[#E21B1B] dark:focus:border-[#F87171]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mr-1">
                    Edition:
                  </span>
                  {(
                    [
                      { value: 'all', label: 'All Publications' },
                      { value: 'monographs', label: 'Monographs' },
                      { value: 'dispatches', label: 'Dispatches' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFrequency(opt.value)}
                      className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] transition-colors border whitespace-nowrap shrink-0 ${
                        frequency === opt.value
                          ? 'bg-[#E21B1B] text-white border-[#E21B1B] dark:bg-[#DC2626] dark:border-[#DC2626]'
                          : 'bg-transparent text-[#0A0A0A]/70 dark:text-[#9D9A91] border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 hover:border-[#0A0A0A] dark:hover:border-[#F5F4F0] hover:text-[#0A0A0A] dark:hover:text-[#F5F4F0]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] bg-[#0A0A0A] text-[#F8F7F4] dark:bg-[#F5F4F0] dark:text-[#0A0A0A] hover:bg-[#E21B1B] hover:text-white dark:hover:bg-[#DC2626] dark:hover:text-white disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
                >
                  {submitting ? 'Recording...' : 'Subscribe'}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs font-medium text-[#E21B1B] dark:text-[#F87171]">{errorMessage}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
