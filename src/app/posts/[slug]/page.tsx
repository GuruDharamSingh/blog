import { getPostBySlug as getFsPost, getAllPostsMeta } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { InteractiveChart } from '@/components/mdx/InteractiveChart';
import { Callout } from '@/components/mdx/Callout';

const components = {
  InteractiveChart,
  Callout,
  // Add more custom components here
};

export async function generateStaticParams() {
  return getAllPostsMeta().map(p => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getFsPost(slug);
  if (!post) return notFound();
  const { content, meta } = post;
  return (
    <article className="prose prose-lg mx-auto py-12 px-4 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{meta.title}</h1>
        {meta.summary && (
          <p className="text-xl text-gray-600 mb-4">{meta.summary}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time dateTime={meta.date}>{new Date(meta.date).toLocaleDateString()}</time>
          {meta.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {meta.category}
            </span>
          )}
        </div>
      </header>
      <MDXRemote source={content} components={components} />
    </article>
  );
}
