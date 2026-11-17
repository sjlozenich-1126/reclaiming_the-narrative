import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  caption?: string;
}

export function EditorialImage({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-[4/3]',
  caption,
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  const showFallback = !src || failed;

  return (
    <figure className="w-full">
      <div
        className={`relative overflow-hidden border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-[#F1EFEA] dark:bg-[#1C1C19] ${aspectClassName} ${className}`}
      >
        {showFallback ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F1EFEA] to-[#E6E3DC] dark:from-[#151513] dark:to-[#1E1E1B]">
            <BookOpen className="w-7 h-7 text-[#0A0A0A]/60 dark:text-[#9D9A91] mb-2" aria-hidden="true" />
            <span className="font-mono text-xs text-[#0A0A0A]/70 dark:text-[#9D9A91] max-w-xs line-clamp-2">
              {alt}
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-[11px] text-[#0A0A0A]/65 dark:text-[#9D9A91] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
