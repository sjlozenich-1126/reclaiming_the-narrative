import { User } from 'firebase/auth';
import {
  Check,
  Database,
  Download,
  Edit3,
  Eye,
  FilePlus2,
  ImagePlus,
  LogIn,
  Plus,
  ShieldCheck,
  Tag as TagIcon,
  Trash2,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { EditorialImage } from '../components/EditorialImage';
import {
  ArticleInput,
  compressImageFile,
  deleteArticleById,
  deleteTagById,
  estimateReadingTime,
  saveArticle,
  saveTag,
  seedArchiveToFirestore,
  subscribeAllArticlesAdmin,
  subscribeSubscribersAdmin,
} from '../lib/journalService';
import {
  AppRoute,
  JournalArticle,
  JournalTag,
  NewsletterSubscriber,
  TagCategory,
  WayIntoArchive,
} from '../types/journal';

interface AdminPortalViewProps {
  user: User | null;
  isAdmin: boolean;
  tags: JournalTag[];
  onSignIn: () => void;
  onNavigate: (route: AppRoute) => void;
}

const PRESET_IMAGES = [
  {
    label: 'Archival Desk & Legal Dockets',
    url: '/src/assets/images/hero_archive_desk_1794910400705.jpg',
  },
  {
    label: 'Neoclassical Institutional Columns',
    url: '/src/assets/images/essay_epistemic_architecture_1794910400927.jpg',
  },
  {
    label: 'Psychology Monographs & Index Drawers',
    url: '/src/assets/images/essay_clinical_observation_1794910402018.jpg',
  },
  {
    label: 'Counter-Memory Ledger Boxes',
    url: '/src/assets/images/essay_counter_memory_1794910402457.jpg',
  },
  {
    label: 'Author Study & Sealed Dossier',
    url: '/src/assets/images/author_study_folio_1794910401655.jpg',
  },
];

const EMPTY_FORM: ArticleInput = {
  title: '',
  subtitle: '',
  abstract: '',
  body: '',
  authorName: 'Shane J. Lozenich',
  imageUrl: '/src/assets/images/hero_archive_desk_1794910400705.jpg',
  imageCaption: '',
  wayIntoArchive: 'lived-experience',
  tags: [],
  readingTimeMinutes: 6,
  issueNumber: 'Vol. I · Dispatch',
  displayDate: 'November 2026',
  sourceDocumentUrl: '',
  published: true,
  featured: false,
};

export function AdminPortalView({
  user,
  isAdmin,
  tags,
  onSignIn,
  onNavigate,
}: AdminPortalViewProps) {
  const [activeTab, setActiveTab] = useState<'compose' | 'articles' | 'tags' | 'subscribers'>('articles');
  const [adminArticles, setAdminArticles] = useState<JournalArticle[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleInput>(EMPTY_FORM);
  const [savingArticle, setSavingArticle] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagCategory, setTagCategory] = useState<TagCategory>('Psychoanalytic');
  const [tagDescription, setTagDescription] = useState('');
  const [savingTag, setSavingTag] = useState(false);

  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const unsubArticles = subscribeAllArticlesAdmin(
      (list) => setAdminArticles(list),
      (err) => setFeedback({ type: 'error', text: err.message })
    );
    const unsubSubs = subscribeSubscribersAdmin(
      (list) => setSubscribers(list),
      (err) => setFeedback({ type: 'error', text: err.message })
    );
    return () => {
      unsubArticles();
      unsubSubs();
    };
  }, [isAdmin]);

  if (!user || !isAdmin) {
    return (
      <div className="py-16 sm:py-24">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="border-2 border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] p-8 space-y-5">
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              <ShieldCheck className="w-4 h-4" />
              Editorial Desk Authentication
            </div>
            <h1 className="font-display text-4xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
              Author Sign-In
            </h1>
            <p className="text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] leading-relaxed">
              Sign in with your verified Google account (<strong>jscthebrand@gmail.com</strong>) to write and publish essays, upload imagery, manage custom taxonomy tags, and inspect subscriber dispatches.
            </p>
            {user && !isAdmin && (
              <p className="text-xs text-[#E21B1B] dark:text-[#F87171] border border-[#E21B1B] p-3">
                Signed in as {user.email}, which does not hold editorial admin authorization.
              </p>
            )}
            <button
              type="button"
              onClick={onSignIn}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSeedArchive = async () => {
    setSeeding(true);
    setFeedback(null);
    try {
      const res = await seedArchiveToFirestore(user.uid);
      setFeedback({
        type: 'success',
        text: `Archive synchronized: ${res.articlesSeeded} essays and ${res.tagsSeeded} tags added to Firestore.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to sync archive.',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setFeedback(null);
    try {
      const compressed = await compressImageFile(file);
      setForm((prev) => ({ ...prev, imageUrl: compressed }));
      setFeedback({ type: 'success', text: 'Image processed and attached to essay.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to process image upload.',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleStartNewArticle = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setActiveTab('compose');
    setFeedback(null);
  };

  const handleEditArticle = (article: JournalArticle) => {
    setEditingId(article.id);
    setForm({
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      abstract: article.abstract,
      body: article.body,
      authorName: article.authorName || 'Shane J. Lozenich',
      imageUrl: article.imageUrl,
      imageCaption: article.imageCaption,
      wayIntoArchive: article.wayIntoArchive,
      tags: article.tags || [],
      readingTimeMinutes: article.readingTimeMinutes,
      issueNumber: article.issueNumber,
      displayDate: article.displayDate,
      sourceDocumentUrl: article.sourceDocumentUrl || '',
      published: article.published,
      featured: article.featured,
    });
    setActiveTab('compose');
    setFeedback(null);
  };

  const handleSaveArticle = async (publishState: boolean) => {
    if (form.title.trim().length < 3) {
      setFeedback({ type: 'error', text: 'Title must be at least 3 characters.' });
      return;
    }
    if (form.abstract.trim().length < 10) {
      setFeedback({ type: 'error', text: 'Abstract must be at least 10 characters.' });
      return;
    }
    if (form.body.trim().length < 20) {
      setFeedback({ type: 'error', text: 'Essay body must be at least 20 characters.' });
      return;
    }

    setSavingArticle(true);
    setFeedback(null);
    try {
      const computedMinutes = form.readingTimeMinutes || estimateReadingTime(form.body);
      await saveArticle(
        {
          ...form,
          published: publishState,
          readingTimeMinutes: computedMinutes,
        },
        user.uid,
        !editingId
      );
      setFeedback({
        type: 'success',
        text: publishState
          ? 'Essay published live to Reclaiming the Narrative.'
          : 'Essay saved as an unpublished draft.',
      });
      setEditingId(null);
      setForm(EMPTY_FORM);
      setActiveTab('articles');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save essay.',
      });
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, title: string) => {
    setFeedback(null);
    try {
      await deleteArticleById(articleId);
      setFeedback({ type: 'success', text: `Removed "${title}" from Firestore.` });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to delete essay.',
      });
    }
  };

  const toggleFormTag = (tagLabel: string) => {
    setForm((prev) => {
      const exists = prev.tags.includes(tagLabel);
      if (exists) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tagLabel) };
      }
      if (prev.tags.length >= 10) {
        setFeedback({ type: 'error', text: 'A maximum of 10 tags per essay is supported.' });
        return prev;
      }
      return { ...prev, tags: [...prev.tags, tagLabel] };
    });
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tagName.trim().length < 2) {
      setFeedback({ type: 'error', text: 'Tag name must be at least 2 characters.' });
      return;
    }
    setSavingTag(true);
    setFeedback(null);
    try {
      await saveTag(
        {
          id: editingTagId || undefined,
          name: tagName,
          description: tagDescription,
          category: tagCategory,
        },
        user.uid,
        !editingTagId
      );
      setFeedback({
        type: 'success',
        text: editingTagId ? `Updated tag "${tagName}".` : `Created tag "${tagName}".`,
      });
      setEditingTagId(null);
      setTagName('');
      setTagDescription('');
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save tag.',
      });
    } finally {
      setSavingTag(false);
    }
  };

  const handleDeleteTag = async (tagId: string, name: string) => {
    setFeedback(null);
    try {
      await deleteTagById(tagId);
      setFeedback({ type: 'success', text: `Deleted tag "${name}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete tag.',
      });
    }
  };

  const insertMarkdownSnippet = (snippet: string) => {
    setForm((prev) => ({
      ...prev,
      body: `${prev.body}${prev.body.endsWith('\n') || !prev.body ? '' : '\n\n'}${snippet}`,
    }));
  };

  const handleExportSubscribersCsv = () => {
    const header = 'Email,Name,Frequency\n';
    const rows = subscribers
      .map(
        (s) =>
          `"${(s.email || '').replace(/"/g, '""')}","${(s.name || '').replace(/"/g, '""')}","${s.frequency}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reclaiming-the-narrative-subscribers.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    'w-full px-3.5 py-2 text-sm bg-[#F8F7F4] dark:bg-[#0C0C0B] border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 text-[#0A0A0A] dark:text-[#F5F4F0] focus:outline-none focus:border-[#E21B1B] dark:focus:border-[#F87171]';

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 space-y-8">
        {/* Desk Header */}
        <header className="pb-6 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
              Editorial Publishing Desk · Signed in as {user.email}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-1">
              Shane J. Lozenich — Studio &amp; Taxonomy Manager
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSeedArchive}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] bg-white dark:bg-[#151513] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] disabled:opacity-50 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              {seeding ? 'Syncing...' : 'Sync 8 Foundational Essays'}
            </button>
            <button
              type="button"
              onClick={handleStartNewArticle}
              className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] transition-colors"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              Write New Essay
            </button>
          </div>
        </header>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 border text-sm flex items-center justify-between gap-4 ${
              feedback.type === 'success'
                ? 'border-[#0A0A0A] bg-white text-[#0A0A0A] dark:border-[#F5F4F0] dark:bg-[#151513] dark:text-[#F5F4F0]'
                : 'border-[#E21B1B] bg-[#E21B1B]/10 text-[#991B1B] dark:border-[#F87171] dark:bg-[#DC2626]/20 dark:text-[#FECACA]'
            }`}
          >
            <span>{feedback.text}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="font-mono text-[11px] font-bold uppercase underline underline-offset-4 shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Desk Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border transition-colors ${
              activeTab === 'articles'
                ? 'bg-[#E21B1B] text-white border-[#E21B1B] dark:bg-[#DC2626] dark:border-[#DC2626]'
                : 'border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 bg-white dark:bg-[#151513] text-[#0A0A0A]/75 dark:text-[#D4D2CC]'
            }`}
          >
            Published &amp; Drafts ({adminArticles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('compose')}
            className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border transition-colors ${
              activeTab === 'compose'
                ? 'bg-[#E21B1B] text-white border-[#E21B1B] dark:bg-[#DC2626] dark:border-[#DC2626]'
                : 'border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 bg-white dark:bg-[#151513] text-[#0A0A0A]/75 dark:text-[#D4D2CC]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {editingId ? 'Editing Essay' : 'Compose Essay'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tags')}
            className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border transition-colors ${
              activeTab === 'tags'
                ? 'bg-[#E21B1B] text-white border-[#E21B1B] dark:bg-[#DC2626] dark:border-[#DC2626]'
                : 'border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 bg-white dark:bg-[#151513] text-[#0A0A0A]/75 dark:text-[#D4D2CC]'
            }`}
          >
            <TagIcon className="w-3.5 h-3.5" />
            Custom Tags ({tags.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscribers')}
            className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border transition-colors ${
              activeTab === 'subscribers'
                ? 'bg-[#E21B1B] text-white border-[#E21B1B] dark:bg-[#DC2626] dark:border-[#DC2626]'
                : 'border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 bg-white dark:bg-[#151513] text-[#0A0A0A]/75 dark:text-[#D4D2CC]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Newsletter Subscribers ({subscribers.length})
          </button>
        </div>

        {/* TAB 1: ARTICLES LIST */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            {adminArticles.length === 0 ? (
              <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-10 text-center space-y-4">
                <h2 className="font-display text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                  Your Firestore archive is ready to populate
                </h2>
                <p className="text-sm text-[#0A0A0A]/75 dark:text-[#D4D2CC] max-w-lg mx-auto">
                  Click “Sync 8 Foundational Essays” above to commit all 8 attached papers and taxonomy tags into your live Firestore database for editing, or write a new essay directly.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#0A0A0A]/20 dark:divide-[#F5F4F0]/20 border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513]">
                {adminArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">
                        <span
                          className={
                            article.published
                              ? 'text-[#0A0A0A] dark:text-[#F5F4F0]'
                              : 'text-[#E21B1B] dark:text-[#F87171]'
                          }
                        >
                          {article.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{article.issueNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.displayDate}</span>
                        {article.featured && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#E21B1B] dark:text-[#F87171]">LEAD FEATURE</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-2xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                        {article.title}
                      </h3>
                      <p className="font-mono text-[11px] text-[#0A0A0A]/65 dark:text-[#9D9A91]">
                        {article.tags.join(' / ') || 'Untagged'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigate({ view: 'article', slug: article.slug })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 text-[#0A0A0A]/80 dark:text-[#D4D2CC] hover:border-[#0A0A0A] dark:hover:border-[#F5F4F0]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditArticle(article)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] hover:bg-[#0A0A0A] hover:text-[#F8F7F4] dark:hover:bg-[#F5F4F0] dark:hover:text-[#0A0A0A] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase border border-[#E21B1B]/40 dark:border-[#F87171]/40 text-[#E21B1B] dark:text-[#F87171] hover:border-[#E21B1B]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPOSE / EDIT ARTICLE */}
        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5 border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-6">
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
                <h2 className="font-display text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                  {editingId ? 'Edit Essay' : 'Compose New Essay'}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleStartNewArticle}
                    className="font-mono text-[11px] font-bold uppercase underline underline-offset-4 text-[#0A0A0A]/70 dark:text-[#9D9A91]"
                  >
                    Switch to New Essay
                  </button>
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                  Essay Headline
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter main essay title..."
                  maxLength={300}
                  className="w-full px-3.5 py-2.5 text-lg font-display font-bold bg-[#F8F7F4] dark:bg-[#0C0C0B] border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 text-[#0A0A0A] dark:text-[#F5F4F0]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                  Subtitle / Deck
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Secondary thematic descriptor..."
                  maxLength={500}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                    Author
                  </label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    maxLength={120}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                    Issue / Volume
                  </label>
                  <input
                    type="text"
                    value={form.issueNumber}
                    onChange={(e) => setForm({ ...form, issueNumber: e.target.value })}
                    maxLength={60}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                    Display Date
                  </label>
                  <input
                    type="text"
                    value={form.displayDate}
                    onChange={(e) => setForm({ ...form, displayDate: e.target.value })}
                    maxLength={40}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                  Abstract (Summary)
                </label>
                <textarea
                  rows={3}
                  value={form.abstract}
                  onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                  placeholder="Concise academic abstract for front-page cards and SEO metadata..."
                  maxLength={2000}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                    Essay Body (Markdown Supported)
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertMarkdownSnippet('## Section Heading\n\n')}
                      className="px-2 py-1 font-mono text-[11px] font-bold border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 text-[#0A0A0A]/75 dark:text-[#D4D2CC] hover:border-[#0A0A0A]"
                    >
                      + H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSnippet('> Pull quote text goes here.\n\n')}
                      className="px-2 py-1 font-mono text-[11px] font-bold border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 text-[#0A0A0A]/75 dark:text-[#D4D2CC] hover:border-[#0A0A0A]"
                    >
                      + Quote
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet(
                          '| Column A | Column B |\n| --- | --- |\n| Item 1 | Detail 1 |\n\n'
                        )
                      }
                      className="px-2 py-1 font-mono text-[11px] font-bold border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 text-[#0A0A0A]/75 dark:text-[#D4D2CC] hover:border-[#0A0A0A]"
                    >
                      + Table
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          readingTimeMinutes: estimateReadingTime(prev.body),
                        }))
                      }
                      className="px-2 py-1 font-mono text-[11px] font-bold border border-[#E21B1B]/40 dark:border-[#F87171]/40 text-[#E21B1B] dark:text-[#F87171]"
                    >
                      Auto-Estimate Time
                    </button>
                  </div>
                </div>
                <textarea
                  rows={16}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Write the full essay using ## Section Headings, > pull quotes, **bold**, *italics*, and tables..."
                  maxLength={100000}
                  className="w-full px-3.5 py-3 text-sm font-mono leading-relaxed bg-[#F8F7F4] dark:bg-[#0C0C0B] border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 text-[#0A0A0A] dark:text-[#F5F4F0]"
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-5 space-y-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#E21B1B] dark:text-[#F87171]">
                  Editorial Plate / Image
                </p>
                <EditorialImage
                  src={form.imageUrl}
                  alt={form.title || 'Essay preview image'}
                  aspectClassName="aspect-[4/3]"
                />

                <div>
                  <label className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0] cursor-pointer hover:bg-[#E21B1B] hover:border-[#E21B1B] hover:text-white dark:hover:bg-[#DC2626] dark:hover:border-[#DC2626] transition-colors">
                    <ImagePlus className="w-4 h-4" />
                    {uploadingImage ? 'Compressing Image...' : 'Upload Image from Device'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1">
                    Or Choose Archival Plate
                  </label>
                  <select
                    value={PRESET_IMAGES.some((p) => p.url === form.imageUrl) ? form.imageUrl : ''}
                    onChange={(e) => {
                      if (e.target.value) setForm({ ...form, imageUrl: e.target.value });
                    }}
                    className={inputClass}
                  >
                    <option value="">Custom / Uploaded Image</option>
                    {PRESET_IMAGES.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1">
                    Or Paste Image URL
                  </label>
                  <input
                    type="text"
                    value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://... or /src/assets/..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1">
                    Figure Caption
                  </label>
                  <input
                    type="text"
                    value={form.imageCaption}
                    onChange={(e) => setForm({ ...form, imageCaption: e.target.value })}
                    placeholder="Fig. — Archival description..."
                    maxLength={400}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-5 space-y-4">
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                    Way into Archive
                  </label>
                  <select
                    value={form.wayIntoArchive}
                    onChange={(e) =>
                      setForm({ ...form, wayIntoArchive: e.target.value as WayIntoArchive })
                    }
                    className={inputClass}
                  >
                    <option value="lived-experience">01. The Lived Experience</option>
                    <option value="mechanisms">02. The Mechanisms</option>
                    <option value="counter-archive">03. The Counter Archive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-2">
                    Assign Custom Tags ({form.tags.length}/10)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => {
                      const active = form.tags.includes(t.name);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleFormTag(t.name)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border transition-colors ${
                            active
                              ? 'bg-[#E21B1B] text-white border-[#E21B1B] dark:bg-[#DC2626] dark:border-[#DC2626]'
                              : 'border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 text-[#0A0A0A]/75 dark:text-[#D4D2CC]'
                          }`}
                        >
                          {active && <Check className="w-3 h-3" />}
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1">
                      Read Time (min)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={240}
                      value={form.readingTimeMinutes}
                      onChange={(e) =>
                        setForm({ ...form, readingTimeMinutes: Number(e.target.value) || 5 })
                      }
                      className="w-full px-3 py-1.5 text-sm font-mono bg-[#F8F7F4] dark:bg-[#0C0C0B] border border-[#0A0A0A]/25 dark:border-[#F5F4F0]/25 text-[#0A0A0A] dark:text-[#F5F4F0]"
                    />
                  </div>
                  <div className="flex items-end pb-1.5">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A0A0A] dark:text-[#F5F4F0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      />
                      Lead Monograph
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#0A0A0A]/15 dark:border-[#F5F4F0]/15 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={savingArticle}
                    onClick={() => handleSaveArticle(true)}
                    className="w-full py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626] hover:bg-[#0A0A0A] disabled:opacity-50 transition-colors"
                  >
                    {savingArticle ? 'Saving...' : editingId ? 'Update & Publish' : 'Publish Essay'}
                  </button>
                  <button
                    type="button"
                    disabled={savingArticle}
                    onClick={() => handleSaveArticle(false)}
                    className="w-full py-2 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A]/30 dark:border-[#F5F4F0]/30 text-[#0A0A0A]/75 dark:text-[#D4D2CC] hover:border-[#0A0A0A] dark:hover:border-[#F5F4F0]"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM TAGGING SYSTEM */}
        {activeTab === 'tags' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveTag}
              className="lg:col-span-5 border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-6 space-y-4"
            >
              <h2 className="font-display text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                {editingTagId ? 'Edit Taxonomy Tag' : 'Create Custom Tag'}
              </h2>
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                  Tag Name
                </label>
                <input
                  type="text"
                  required
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g., Ontological Insecurity"
                  maxLength={64}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                  Discipline Category
                </label>
                <select
                  value={tagCategory}
                  onChange={(e) => setTagCategory(e.target.value as TagCategory)}
                  className={inputClass}
                >
                  <option value="Psychoanalytic">Psychoanalytic</option>
                  <option value="Legal & Statutory">Legal &amp; Statutory</option>
                  <option value="Systems & Data">Systems &amp; Data</option>
                  <option value="Archival Method">Archival Method</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]/70 dark:text-[#9D9A91] mb-1.5">
                  Curatorial Definition
                </label>
                <textarea
                  rows={3}
                  value={tagDescription}
                  onChange={(e) => setTagDescription(e.target.value)}
                  placeholder="Brief scope note explaining how this tag organizes the corpus..."
                  maxLength={300}
                  className={inputClass}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingTag}
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] bg-[#E21B1B] text-white dark:bg-[#DC2626]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {savingTag ? 'Saving...' : editingTagId ? 'Update Tag' : 'Add Tag'}
                </button>
                {editingTagId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTagId(null);
                      setTagName('');
                      setTagDescription('');
                    }}
                    className="font-mono text-[11px] font-bold uppercase text-[#0A0A0A]/70 dark:text-[#9D9A91] underline underline-offset-4"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] divide-y divide-[#0A0A0A]/15 dark:divide-[#F5F4F0]/15">
              {tags.map((tag) => {
                const usageCount = adminArticles.filter((a) => a.tags.includes(tag.name)).length;
                return (
                  <div
                    key={tag.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/65 dark:text-[#9D9A91]">
                        <span className="text-[#E21B1B] dark:text-[#F87171]">{tag.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{usageCount} essays</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0] mt-0.5">
                        {tag.name}
                      </h3>
                      {tag.description && (
                        <p className="text-xs text-[#0A0A0A]/70 dark:text-[#9D9A91] mt-1">
                          {tag.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTagId(tag.id);
                          setTagName(tag.name);
                          setTagCategory(tag.category);
                          setTagDescription(tag.description);
                        }}
                        className="px-3 py-1.5 font-mono text-[11px] font-bold uppercase border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTag(tag.id, tag.name)}
                        className="px-3 py-1.5 font-mono text-[11px] font-bold uppercase border border-[#E21B1B]/40 dark:border-[#F87171]/40 text-[#E21B1B] dark:text-[#F87171]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="border border-[#0A0A0A] dark:border-[#F5F4F0]/40 bg-white dark:bg-[#151513] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0]">
              <div>
                <h2 className="font-display text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F4F0]">
                  Newsletter Subscriber Roster
                </h2>
                <p className="text-xs text-[#0A0A0A]/70 dark:text-[#9D9A91] mt-1">
                  Protected PII collection — readable exclusively by verified editorial administrators.
                </p>
              </div>
              {subscribers.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportSubscribersCsv}
                  className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] border border-[#0A0A0A] dark:border-[#F5F4F0] text-[#0A0A0A] dark:text-[#F5F4F0]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              )}
            </div>

            {subscribers.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                No newsletter subscribers recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#0A0A0A] dark:border-[#F5F4F0] font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A]/70 dark:text-[#9D9A91]">
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3">Edition Preference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0A0A0A]/15 dark:divide-[#F5F4F0]/15">
                    {subscribers.map((sub) => (
                      <tr key={sub.id}>
                        <td className="py-3 pr-4 font-mono text-xs text-[#0A0A0A] dark:text-[#F5F4F0]">
                          {sub.email}
                        </td>
                        <td className="py-3 pr-4 text-[#0A0A0A]/75 dark:text-[#D4D2CC]">
                          {sub.name || '—'}
                        </td>
                        <td className="py-3 capitalize text-[#0A0A0A]/75 dark:text-[#D4D2CC]">
                          {sub.frequency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
