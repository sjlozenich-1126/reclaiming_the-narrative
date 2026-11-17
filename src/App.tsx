import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NewsletterSection } from './components/NewsletterSection';
import { SettingsDrawer } from './components/SettingsDrawer';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { SEED_ARTICLES, SEED_TAGS } from './data/seedArticles';
import { useSeoMetadata } from './hooks/useSeoMetadata';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  googleProvider,
} from './lib/firebase';
import {
  seedArchiveToFirestore,
  subscribePublicArticles,
  subscribeTags,
} from './lib/journalService';
import {
  AppRoute,
  JournalArticle,
  JournalTag,
  WayIntoArchive,
} from './types/journal';
import { AboutView } from './views/AboutView';
import { AdminPortalView } from './views/AdminPortalView';
import { ArchiveView } from './views/ArchiveView';
import { ArticleReaderView } from './views/ArticleReaderView';
import { HomeView } from './views/HomeView';
import { MethodologyView } from './views/MethodologyView';

function parseHashRoute(): AppRoute {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart || '');

  if (pathPart === '/archive') {
    const wayParam = params.get('way') as WayIntoArchive | 'all' | null;
    const tagParam = params.get('tag') || '';
    return { view: 'archive', way: wayParam || 'all', tag: tagParam };
  }
  if (pathPart.startsWith('/article/')) {
    const slug = decodeURIComponent(pathPart.replace('/article/', ''));
    return { view: 'article', slug };
  }
  if (pathPart === '/methodology') return { view: 'methodology' };
  if (pathPart === '/about') return { view: 'about' };
  if (pathPart === '/admin') return { view: 'admin' };
  return { view: 'home' };
}

function serializeRouteToHash(route: AppRoute): string {
  switch (route.view) {
    case 'home':
      return '#/';
    case 'archive': {
      const params = new URLSearchParams();
      if (route.way && route.way !== 'all') params.set('way', route.way);
      if (route.tag) params.set('tag', route.tag);
      const q = params.toString();
      return q ? `#/archive?${q}` : '#/archive';
    }
    case 'article':
      return `#/article/${encodeURIComponent(route.slug)}`;
    case 'methodology':
      return '#/methodology';
    case 'about':
      return '#/about';
    case 'admin':
      return '#/admin';
  }
}

function JournalAppShell() {
  const [route, setRoute] = useState<AppRoute>(() => parseHashRoute());
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rtn_dark_mode');
      if (saved !== null) return saved === 'true';
    } catch {
      // Ignore storage access errors
    }
    return false;
  });

  const [largeText, setLargeText] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rtn_large_text') === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [firestoreArticles, setFirestoreArticles] = useState<JournalArticle[] | null>(null);
  const [firestoreTags, setFirestoreTags] = useState<JournalTag[] | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('rtn_dark_mode', String(darkMode));
    } catch {
      // Ignore
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('rtn_large_text', String(largeText));
    } catch {
      // Ignore
    }
  }, [largeText]);

  // Hash navigation listener
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (nextRoute: AppRoute) => {
    const nextHash = serializeRouteToHash(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auth listener + automatic archive seeding for verified admin on first visit
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthError(null);
      if (!nextUser) {
        setIsAdmin(false);
        return;
      }

      let adminVerified =
        Boolean(nextUser.emailVerified) &&
        nextUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

      if (!adminVerified && nextUser.emailVerified) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', nextUser.uid));
          adminVerified = adminDoc.exists();
        } catch {
          adminVerified = false;
        }
      }

      setIsAdmin(adminVerified);

      if (adminVerified) {
        try {
          await seedArchiveToFirestore(nextUser.uid);
        } catch {
          // Non-fatal; admin can trigger manual sync in studio
        }
      }
    });
    return () => unsub();
  }, []);

  // Public Firestore listeners
  useEffect(() => {
    const unsubArticles = subscribePublicArticles(
      (list) => setFirestoreArticles(list),
      () => setFirestoreArticles([])
    );
    const unsubTags = subscribeTags(
      (list) => setFirestoreTags(list),
      () => setFirestoreTags([])
    );
    return () => {
      unsubArticles();
      unsubTags();
    };
  }, []);

  // Merge Firestore articles/tags with fallback seeds so initial load is rich & instantaneous
  const articles = useMemo<JournalArticle[]>(() => {
    if (firestoreArticles && firestoreArticles.length > 0) {
      return [...firestoreArticles].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.issueNumber.localeCompare(b.issueNumber);
      });
    }
    return SEED_ARTICLES as JournalArticle[];
  }, [firestoreArticles]);

  const tags = useMemo<JournalTag[]>(() => {
    if (firestoreTags && firestoreTags.length > 0) {
      return firestoreTags;
    }
    return SEED_TAGS as JournalTag[];
  }, [firestoreTags]);

  const activeArticle = useMemo(() => {
    if (route.view !== 'article') return undefined;
    return articles.find((a) => a.slug === route.slug || a.id === route.slug);
  }, [route, articles]);

  // Dynamic SEO metadata for non-article views (ArticleReaderView handles its own ScholarlyArticle SEO)
  const seoMeta = useMemo(() => {
    switch (route.view) {
      case 'home':
        return {
          title: 'Reclaiming the Narrative — Journal of Psychology & Systems by Shane J. Lozenich',
          description:
            'A true story about navigating institutional dissonance to restore evidentiary coherence. Essays and research monographs by Shane J. Lozenich.',
        };
      case 'archive':
        return {
          title: 'Archive Index — Reclaiming the Narrative by Shane J. Lozenich',
          description:
            'Browse the complete archive of psychoanalytic essays, legal analyses, and counter-archival monographs by Shane J. Lozenich.',
        };
      case 'methodology':
        return {
          title: 'Audit Methodology — Reclaiming the Narrative by Shane J. Lozenich',
          description:
            'Systemic Discrepancy Index, Memory Discrepancy Auditing, and the Parallel Review Framework by Shane J. Lozenich.',
        };
      case 'about':
        return {
          title: 'About Shane J. Lozenich — Reclaiming the Narrative',
          description:
            'Biography, correspondence, and complete bibliography of independent researcher and author Shane J. Lozenich.',
        };
      case 'admin':
        return {
          title: 'Editorial Publishing Desk — Reclaiming the Narrative',
          description: 'Author studio for Shane J. Lozenich.',
        };
      case 'article':
        return {
          title: activeArticle
            ? `${activeArticle.title} — Reclaiming the Narrative`
            : 'Reclaiming the Narrative — Shane J. Lozenich',
          description: activeArticle?.abstract || 'Essay by Shane J. Lozenich.',
        };
    }
  }, [route.view, activeArticle]);

  useSeoMetadata({
    title: seoMeta.title,
    description: seoMeta.description,
    article: route.view === 'article' ? activeArticle || null : null,
  });

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to complete Google sign-in.'
      );
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    await signOut(auth);
    if (route.view === 'admin') {
      navigate({ view: 'home' });
    }
  };

  const scrollToNewsletter = () => {
    const el = document.getElementById('newsletter-dispatch');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#0A0A0A] dark:bg-[#0C0C0B] dark:text-[#F5F4F0] transition-colors duration-200">
      <SiteHeader
        route={route}
        isAdminSignedIn={isAdmin}
        onNavigate={navigate}
        onOpenSettings={() => setSettingsOpen(true)}
        onScrollToNewsletter={scrollToNewsletter}
      />

      <main className="flex-1">
        {route.view === 'home' && (
          <HomeView articles={articles} onNavigate={navigate} />
        )}
        {route.view === 'archive' && (
          <ArchiveView
            key={`${route.way || 'all'}-${route.tag || ''}`}
            articles={articles}
            tags={tags}
            initialWay={route.way || 'all'}
            initialTag={route.tag || ''}
            onNavigate={navigate}
          />
        )}
        {route.view === 'article' && (
          <ArticleReaderView
            article={activeArticle}
            allArticles={articles}
            largeText={largeText}
            onNavigate={navigate}
          />
        )}
        {route.view === 'methodology' && (
          <MethodologyView onNavigate={navigate} />
        )}
        {route.view === 'about' && (
          <AboutView articles={articles} onNavigate={navigate} />
        )}
        {route.view === 'admin' && (
          <AdminPortalView
            user={user}
            isAdmin={isAdmin}
            tags={tags}
            onSignIn={handleSignIn}
            onNavigate={navigate}
          />
        )}
      </main>

      {route.view !== 'admin' && <NewsletterSection />}

      <SiteFooter
        onNavigate={navigate}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <SettingsDrawer
        open={settingsOpen}
        darkMode={darkMode}
        largeText={largeText}
        user={user}
        isAdmin={isAdmin}
        authError={authError}
        onClose={() => setSettingsOpen(false)}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onToggleLargeText={() => setLargeText((prev) => !prev)}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onNavigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <JournalAppShell />
    </ErrorBoundary>
  );
}
