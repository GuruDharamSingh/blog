import Link from "next/link";
import Image from "next/image";
import { getAllPostsMeta, getUpcomingEvents, getAllCreativeMeta, getAllTasksMeta } from "@/lib/posts";
import EventCard from "@/components/EventCard";
import CreativeCard from "@/components/CreativeCard";

// Static rendering from filesystem posts
export const dynamic = 'force-static';

export default async function Dashboard() {
  const allPosts = getAllPostsMeta();
  const regularPosts = allPosts.filter(p => p.content_type === 'post');
  const featuredPosts = regularPosts.filter(p => p.featured);
  const recentPosts = regularPosts.filter(p => !p.featured).slice(0, 6);
  
  // Get counts for other content types
  const upcomingEvents = getUpcomingEvents();
  const recentCreative = getAllCreativeMeta();
  const activeTasks = getAllTasksMeta().filter(t => t.status === 'active');
  
  return (
    <main className="mx-auto max-w-6xl py-12 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Content Dashboard</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage your blog posts, creative projects, events, and tasks all in one place.
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to Public Blog
        </Link>
      </div>

      {/* Navigation Bar with Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-1 mb-8 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          <Link href="/posts" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors">
            📝 Posts ({regularPosts.length})
          </Link>
          <Link href="/events" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors">
            📅 Events ({upcomingEvents.length})
          </Link>
          <Link href="/creative" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors">
            🎨 Creative ({recentCreative.length})
          </Link>
          <Link href="/tasks" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors">
            ✅ Tasks ({activeTasks.length})
          </Link>
          <Link href="/admin" className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md font-medium border border-blue-200">
            ⚙️ Admin
          </Link>
        </div>
      </div>
      
      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-800 flex items-center gap-2">
            ⭐ Featured Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((p) => (
              <article key={p.slug} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
                {p.featured_image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={p.featured_image}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {p.category}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      ⭐ Featured
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(p.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    href={`/posts/${p.slug}`}
                    className="text-xl font-semibold hover:text-blue-600 transition-colors block mb-2"
                  >
                    {p.title}
                  </Link>
                  {p.summary && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{p.summary}</p>
                  )}
                  {p.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 4).map((t: string) => (
                        <span
                          key={t}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                      {p.tags.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{p.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            {featuredPosts.length > 0 ? '📝 Recent Posts' : '📝 All Posts'}
          </h2>
          {regularPosts.length > 6 && (
            <Link href="/posts" className="text-blue-600 hover:text-blue-800 text-sm">
              View all {regularPosts.length} posts →
            </Link>
          )}
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="space-y-6">
            {recentPosts.map((p) => (
              <article key={p.slug} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {p.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  href={`/posts/${p.slug}`}
                  className="text-xl font-semibold hover:text-blue-600 transition-colors block mb-2"
                >
                  {p.title}
                </Link>
                {p.summary && (
                  <p className="text-gray-700 text-sm mb-3">{p.summary}</p>
                )}
                {p.tags?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 4).map((t: string) => (
                      <span
                        key={t}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                    {p.tags.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{p.tags.length - 4} more
                      </span>
                    )}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No posts found.</p>
          </div>
        )}
      </section>

      {/* Quick Links to Other Content */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-neutral-800">Content Overview</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/events" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <h4 className="font-medium">Events</h4>
                <p className="text-sm text-gray-600">{upcomingEvents.length} upcoming</p>
              </div>
            </div>
          </Link>
          
          <Link href="/creative" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h4 className="font-medium">Creative</h4>
                <p className="text-sm text-gray-600">{recentCreative.length} projects</p>
              </div>
            </div>
          </Link>
          
          <Link href="/tasks" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-medium">Tasks</h4>
                <p className="text-sm text-gray-600">{activeTasks.length} active</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
