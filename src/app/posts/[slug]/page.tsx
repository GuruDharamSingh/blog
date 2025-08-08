import { getPostBySlug as getFsPost, getAllPostsMeta } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPost } from '@/lib/firestoreClient';

export async function generateStaticParams() {
  return getAllPostsMeta().map(p => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const firestorePost = await getPost(params.slug);
  if (firestorePost && firestorePost.body) {
    return (
      <article className="prose mx-auto py-12 px-4">
        <h1>{firestorePost.title}</h1>
        <MDXRemote source={firestorePost.body} />
      </article>
    );
  }
  const post = getFsPost(params.slug);
  if (!post) return notFound();
  const { content, meta } = post;
  return (
    <article className="prose mx-auto py-12 px-4">
      <h1>{meta.title}</h1>
      <MDXRemote source={content} />
    </article>
  );
}
