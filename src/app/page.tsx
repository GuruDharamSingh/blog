import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamic = 'force-static';

export default async function Home() {
  const allPosts = getAllPostsMeta();
  const posts = allPosts.filter(p => p.content_type === 'post').slice(0, 10);
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <section>
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-800 pb-8 last:border-b-0">
                <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                  <time>{new Date(post.date).toLocaleDateString()}</time>
                  {post.category && (
                    <>
                      <span>•</span>
                      <span>{post.category}</span>
                    </>
                  )}
                </div>
                
                <Link 
                  href={`/posts/${post.slug}`}
                  className="group block"
                >
                  <h2 className="text-2xl font-light mb-3 group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h2>
                  
                  {post.summary && (
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {post.summary}
                    </p>
                  )}
                </Link>
                
                {post.tags?.length && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 5).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-600 bg-gray-900 px-2 py-1 rounded border border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No posts yet.</p>
            <Link 
              href="/private" 
              className="text-gray-400 hover:text-white mt-4 inline-block border-b border-gray-700 hover:border-gray-500 transition-all"
            >
              Create your first post →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}