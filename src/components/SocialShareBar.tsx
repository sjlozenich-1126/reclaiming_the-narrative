import { Check, Copy, Mail, Printer, Share2 } from 'lucide-react';
import { useState } from 'react';

interface SocialShareBarProps {
  title: string;
  summary: string;
  compact?: boolean;
}

export function SocialShareBar({ title, summary, compact = false }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`${title} — by Shane J. Lozenich`);
  const encodedBody = encodeURIComponent(`${title}\n\n${summary}\n\nRead at: ${shareUrl}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Reclaiming the Narrative`,
          text: summary,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      void handleCopy();
    }
  };

  const linkBtnClass =
    'inline-flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.06em] border border-[#0A0A0A] dark:border-[#F5F4F0]/40 text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0';

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkBtnClass}
        aria-label="Share on X"
      >
        X / Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkBtnClass}
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
      <a
        href={`https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkBtnClass}
        aria-label="Share on Bluesky"
      >
        Bluesky
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedBody}`}
        className={linkBtnClass}
        aria-label="Share via Email"
      >
        <Mail className="w-3.5 h-3.5" aria-hidden="true" />
        Email
      </a>
      <button type="button" onClick={handleCopy} className={linkBtnClass}>
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#E21B1B] dark:text-[#F87171]" aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            Copy Link
          </>
        )}
      </button>
      {!compact && (
        <>
          <button type="button" onClick={handleNativeShare} className={linkBtnClass}>
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            Share
          </button>
          <button type="button" onClick={() => window.print()} className={linkBtnClass}>
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            Print Edition
          </button>
        </>
      )}
    </div>
  );
}
