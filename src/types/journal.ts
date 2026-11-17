export type WayIntoArchive = 'lived-experience' | 'mechanisms' | 'counter-archive';

export type TagCategory =
  | 'Psychoanalytic'
  | 'Legal & Statutory'
  | 'Systems & Data'
  | 'Archival Method';

export type NewsletterFrequency = 'dispatches' | 'monographs' | 'all';

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  abstract: string;
  body: string;
  authorName: string;
  authorUid: string;
  imageUrl: string;
  imageCaption: string;
  wayIntoArchive: WayIntoArchive;
  tags: string[];
  readingTimeMinutes: number;
  issueNumber: string;
  displayDate: string;
  sourceDocumentUrl?: string;
  published: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface JournalTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TagCategory;
  createdByUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  frequency: NewsletterFrequency;
  createdAt?: unknown;
}

export type AppRoute =
  | { view: 'home' }
  | { view: 'archive'; way?: WayIntoArchive | 'all'; tag?: string }
  | { view: 'article'; slug: string }
  | { view: 'methodology' }
  | { view: 'about' }
  | { view: 'admin' };
