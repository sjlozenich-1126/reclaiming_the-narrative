import { useEffect } from 'react';
import { JournalArticle } from '../types/journal';

interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  article?: JournalArticle | null;
}

function setMetaTag(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeoMetadata({ title, description, image, article }: SeoConfig) {
  useEffect(() => {
    const cleanTitle = title.slice(0, 75);
    const cleanDescription = description.slice(0, 165);
    const canonicalUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
    const ogImage = image || '/src/assets/images/hero_archive_desk_1794910400705.jpg';

    document.title = cleanTitle;

    setMetaTag('meta[name="description"]', 'name', 'description', cleanDescription);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', cleanTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', cleanDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', article ? 'article' : 'website');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    if (!ogImage.startsWith('data:')) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    }
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', cleanTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', cleanDescription);

    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    const ldScriptId = 'ld-json-dynamic';
    let ldScript = document.getElementById(ldScriptId) as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = ldScriptId;
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }

    if (article) {
      ldScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline: article.title,
        alternativeHeadline: article.subtitle,
        description: article.abstract,
        author: {
          '@type': 'Person',
          name: article.authorName || 'Shane J. Lozenich',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Reclaiming the Narrative',
        },
        keywords: article.tags.join(', '),
        inLanguage: 'en-US',
        url: canonicalUrl,
      });
    } else {
      ldScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Reclaiming the Narrative',
        description: cleanDescription,
        author: {
          '@type': 'Person',
          name: 'Shane J. Lozenich',
        },
        url: canonicalUrl,
      });
    }
  }, [title, description, image, article]);
}
