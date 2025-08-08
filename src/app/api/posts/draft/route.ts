import { NextRequest, NextResponse } from 'next/server';
import { upsertDraft } from '@/lib/firestorePosts';

export async function POST(req: NextRequest) {
  try {
    const { slug, title, body, summary, tags } = await req.json();
    if (!slug) throw new Error('Missing slug');
    await upsertDraft(slug, { title, body, summary, tags });
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
