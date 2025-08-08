import Link from "next/link";
import { listPublishedPosts } from "@/lib/firestoreClient";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let posts: any[] = [];
  try {
    posts = await listPublishedPosts();
  } catch {}
  if (!posts || posts.length === 0) {
    posts = getAllPostsMeta();
  }
  return (
    <main className="mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.slug} className="border-b border-neutral-200 pb-4">
            <Link
              href={`/posts/${p.slug}`}
              className="text-2xl font-semibold hover:underline"
            >
              {p.title}
            </Link>
            {p.summary && (
              <p className="mt-2 text-neutral-700 text-sm">{p.summary}</p>
            )}
            {p.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs bg-neutral-100 px-2 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
