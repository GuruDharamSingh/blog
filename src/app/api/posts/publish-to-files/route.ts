import { NextRequest, NextResponse } from 'next/server';
import { createPostFile } from '@/lib/posts';

export async function POST(req: NextRequest) {
  try {
    const { slug, title, body, summary, tags } = await req.json();
    if (!title || !body) throw new Error('Missing title or body');
    const { slug: finalSlug } = createPostFile(slug || title, { title, summary, tags, published: true }, body);
    return NextResponse.json({ ok: true, slug: finalSlug });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
