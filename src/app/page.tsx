import Link from "next/link";
import Image from "next/image";
import { getAllPostsMeta } from "@/lib/posts";

// Static rendering from filesystem posts
export const dynamic = 'force-static';

export default async function Home() {
  const allPosts = getAllPostsMeta();
  const featuredPosts = allPosts.filter(p => p.featured);
  const regularPosts = allPosts.filter(p => !p.featured);
  
  return (
    <main className="mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-800">Featured Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((p) => (
              <article key={p.slug} className="bg-neutral-50 rounded-lg p-6 border">
                {p.featured_image && (
                  <div className="mb-4 relative h-48 w-full">
                    <Image
                      src={p.featured_image}
                      alt={p.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {p.category}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⭐ Featured
                  </span>
                </div>
                <Link
                  href={`/posts/${p.slug}`}
                  className="text-xl font-semibold hover:underline block mb-2"
                >
                  {p.title}
                </Link>
                {p.summary && (
                  <p className="text-neutral-700 text-sm mb-3">{p.summary}</p>
                )}
                {p.tags?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t: string) => (
                      <span
                        key={t}
                        className="text-xs bg-neutral-200 px-2 py-1 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Regular Posts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
          {featuredPosts.length > 0 ? 'Recent Posts' : 'All Posts'}
        </h2>
        <ul className="space-y-6">
          {regularPosts.map((p) => (
            <li key={p.slug} className="border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                  {p.category}
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(p.date).toLocaleDateString()}
                </span>
              </div>
              <Link
                href={`/posts/${p.slug}`}
                className="text-2xl font-semibold hover:underline block"
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
      </section>
    </main>
  );
}
