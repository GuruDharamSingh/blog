import { app } from './firebase/client';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

const db = getFirestore(app);

export type FirestorePost = {
  slug: string;
  title: string;
  summary?: string;
  tags?: string[];
  body?: string;
  draft?: boolean;
  published?: boolean;
  authorId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function listPublishedPosts(limitCount = 50) {
  try {
    const q = query(collection(db, 'posts'), where('published', '==', true), limit(limitCount));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ slug: d.id, ...d.data() }));
    return items.sort((a: any, b: any) => new Date(b.updatedAt?.toDate?.() || b.updatedAt || 0).getTime() - new Date(a.updatedAt?.toDate?.() || a.updatedAt || 0).getTime());
  } catch {
    return [];
  }
}

export async function getPost(slug: string) {
  try {
    const docRef = doc(db, 'posts', slug);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { slug: docSnap.id, ...docSnap.data() } as FirestorePost;
  } catch {
    return null;
  }
}

export async function upsertDraft(slug: string, data: Partial<FirestorePost>, authorId: string) {
  const now = new Date();
  const docRef = doc(db, 'posts', slug);
  await setDoc(docRef, {
    slug,
    draft: true,
    published: false,
    authorId,
    createdAt: now,
    updatedAt: now,
    ...data,
  }, { merge: true });
}

export async function publishPost(slug: string) {
  const now = new Date();
  const docRef = doc(db, 'posts', slug);
  await setDoc(docRef, {
    draft: false,
    published: true,
    updatedAt: now
  }, { merge: true });
}
