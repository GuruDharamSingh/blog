import { dbAdmin } from './firebase/admin';

export type FirestorePost = {
  slug: string;
  title: string;
  summary?: string;
  tags?: string[];
  body?: string; // inline markdown if used
  draft?: boolean;
  published?: boolean;
  createdAt: FirebaseFirestore.Timestamp | Date;
  updatedAt: FirebaseFirestore.Timestamp | Date;
};

export async function listPublishedPosts(limit = 50) {
  if (!dbAdmin) return [];
  const snap = await dbAdmin.collection('posts').where('published','==', true).limit(limit).get();
  const items = snap.docs.map(d => ({ slug: d.id, ...(d.data() as any) }));
  return items.sort((a:any,b:any)=> new Date(b.updatedAt?.toDate?.() || b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt?.toDate?.() || a.updatedAt || a.createdAt || 0).getTime());
}

export async function getPost(slug: string) {
  if (!dbAdmin) return null;
  const doc = await dbAdmin.collection('posts').doc(slug).get();
  if (!doc.exists) return null;
  return { slug: doc.id, ...(doc.data() as any) } as FirestorePost;
}

export async function upsertDraft(slug: string, data: Partial<FirestorePost>) {
  if (!dbAdmin) throw new Error('Admin not initialized');
  const now = new Date();
  await dbAdmin.collection('posts').doc(slug).set({
    slug,
    draft: true,
    published: false,
    createdAt: data.createdAt || now,
    updatedAt: now,
    ...data,
  }, { merge: true });
}

export async function publishPost(slug: string) {
  if (!dbAdmin) throw new Error('Admin not initialized');
  const now = new Date();
  await dbAdmin.collection('posts').doc(slug).set({
    draft: false,
    published: true,
    updatedAt: now
  }, { merge: true });
}
