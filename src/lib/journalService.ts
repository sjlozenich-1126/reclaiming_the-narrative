import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { SEED_ARTICLES, SEED_TAGS } from '../data/seedArticles';
import {
  JournalArticle,
  JournalTag,
  NewsletterFrequency,
  NewsletterSubscriber,
  TagCategory,
  WayIntoArchive,
} from '../types/journal';
import { db, handleFirestoreError, OperationType } from './firebase';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 140);
}

export function sanitizeId(input: string): string {
  const cleaned = input.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  return cleaned || `item-${Date.now()}`;
}

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.min(240, Math.ceil(words / 220)));
}

export async function compressImageFile(file: File, maxWidth = 1280, maxDataUrlLength = 380000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const targetWidth = Math.max(1, Math.round(img.width * scale));
        const targetHeight = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        let quality = 0.82;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > maxDataUrlLength && quality > 0.35) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        if (dataUrl.length > 440000) {
          reject(new Error('Image exceeds storage size limit even after compression. Please use a smaller image or URL.'));
          return;
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function subscribePublicArticles(
  onData: (articles: JournalArticle[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'articles';
  const q = query(collection(db, path), where('published', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const list = snapshot.docs.map((d) => d.data() as JournalArticle);
      onData(list);
    },
    (error) => {
      if (onError) {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (wrapped) {
          onError(wrapped as Error);
        }
      }
    }
  );
}

export function subscribeAllArticlesAdmin(
  onData: (articles: JournalArticle[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'articles';
  const q = query(collection(db, path), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as JournalArticle);
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError) onError(wrapped as Error);
      }
    }
  );
}

export function subscribeTags(
  onData: (tags: JournalTag[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'tags';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const list = snapshot.docs.map((d) => d.data() as JournalTag);
      list.sort((a, b) => a.name.localeCompare(b.name));
      onData(list);
    },
    (error) => {
      if (onError) {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (wrapped) {
          onError(wrapped as Error);
        }
      }
    }
  );
}

export function subscribeSubscribersAdmin(
  onData: (subscribers: NewsletterSubscriber[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'subscribers';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<NewsletterSubscriber, 'id'>),
      }));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError) onError(wrapped as Error);
      }
    }
  );
}

export interface ArticleInput {
  id?: string;
  title: string;
  subtitle: string;
  abstract: string;
  body: string;
  authorName: string;
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
}

export async function saveArticle(
  input: ArticleInput,
  authorUid: string,
  isNew: boolean
): Promise<string> {
  const baseSlug = slugify(input.title) || `essay-${Date.now()}`;
  const docId = isNew
    ? sanitizeId(`${baseSlug}-${Date.now().toString(36)}`)
    : sanitizeId(input.id || baseSlug);

  const safePayload: Record<string, unknown> = {
    id: docId,
    slug: isNew ? baseSlug : slugify(input.title) || baseSlug,
    title: input.title.trim().slice(0, 300),
    subtitle: input.subtitle.trim().slice(0, 500),
    abstract: input.abstract.trim().slice(0, 2000),
    body: input.body.trim().slice(0, 100000),
    authorName: (input.authorName.trim() || 'Shane J. Lozenich').slice(0, 120),
    imageUrl: input.imageUrl.trim().slice(0, 450000),
    imageCaption: input.imageCaption.trim().slice(0, 400),
    wayIntoArchive: input.wayIntoArchive,
    tags: input.tags.slice(0, 10).map((t) => t.trim().slice(0, 64)).filter(Boolean),
    readingTimeMinutes: Math.max(1, Math.min(240, Math.round(input.readingTimeMinutes || 5))),
    issueNumber: (input.issueNumber.trim() || 'Vol. I · Dispatch').slice(0, 60),
    displayDate: (input.displayDate.trim() || 'November 2026').slice(0, 40),
    published: Boolean(input.published),
    featured: Boolean(input.featured),
    updatedAt: serverTimestamp(),
  };

  if (input.sourceDocumentUrl && input.sourceDocumentUrl.trim().length > 0) {
    safePayload.sourceDocumentUrl = input.sourceDocumentUrl.trim().slice(0, 300);
  }

  const docPath = `articles/${docId}`;
  try {
    if (isNew) {
      await setDoc(doc(db, 'articles', docId), {
        ...safePayload,
        authorUid,
        createdAt: serverTimestamp(),
      });
    } else {
      const updateFields = { ...safePayload };
      delete updateFields.id;
      await updateDoc(doc(db, 'articles', docId), updateFields);
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, docPath);
  }
}

export async function deleteArticleById(articleId: string): Promise<void> {
  const docPath = `articles/${articleId}`;
  try {
    await deleteDoc(doc(db, 'articles', articleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export interface TagInput {
  id?: string;
  name: string;
  description: string;
  category: TagCategory;
}

export async function saveTag(input: TagInput, uid: string, isNew: boolean): Promise<string> {
  const slug = slugify(input.name) || `tag-${Date.now()}`;
  const docId = isNew ? sanitizeId(slug) : sanitizeId(input.id || slug);
  const docPath = `tags/${docId}`;
  try {
    if (isNew) {
      await setDoc(doc(db, 'tags', docId), {
        id: docId,
        name: input.name.trim().slice(0, 64),
        slug: slug.slice(0, 64),
        description: input.description.trim().slice(0, 300),
        category: input.category,
        createdByUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(doc(db, 'tags', docId), {
        name: input.name.trim().slice(0, 64),
        slug: slug.slice(0, 64),
        description: input.description.trim().slice(0, 300),
        category: input.category,
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, docPath);
  }
}

export async function deleteTagById(tagId: string): Promise<void> {
  const docPath = `tags/${tagId}`;
  try {
    await deleteDoc(doc(db, 'tags', tagId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function subscribeToNewsletter(
  email: string,
  name: string,
  frequency: NewsletterFrequency
): Promise<void> {
  const cleanEmail = email.trim().toLowerCase().slice(0, 200);
  const subId = sanitizeId(`sub-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '-')}`);
  const docPath = `subscribers/${subId}`;
  try {
    await setDoc(doc(db, 'subscribers', subId), {
      email: cleanEmail,
      name: name.trim().slice(0, 120),
      frequency,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function seedArchiveToFirestore(uid: string): Promise<{ articlesSeeded: number; tagsSeeded: number }> {
  try {
    const existingArticles = await getDocs(collection(db, 'articles'));
    const existingTags = await getDocs(collection(db, 'tags'));

    const existingArticleIds = new Set(existingArticles.docs.map((d) => d.id));
    const existingTagIds = new Set(existingTags.docs.map((d) => d.id));

    const batch = writeBatch(db);
    let articlesSeeded = 0;
    let tagsSeeded = 0;

    for (const tag of SEED_TAGS) {
      if (!existingTagIds.has(tag.id)) {
        batch.set(doc(db, 'tags', tag.id), {
          ...tag,
          createdByUid: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        tagsSeeded += 1;
      }
    }

    for (const article of SEED_ARTICLES) {
      if (!existingArticleIds.has(article.id)) {
        batch.set(doc(db, 'articles', article.id), {
          ...article,
          authorUid: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        articlesSeeded += 1;
      }
    }

    if (articlesSeeded > 0 || tagsSeeded > 0) {
      await batch.commit();
    }

    return { articlesSeeded, tagsSeeded };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'articles');
  }
}
