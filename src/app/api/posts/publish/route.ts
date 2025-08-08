import { NextRequest, NextResponse } from 'next/server';
import { publishPost } from '@/lib/firestorePosts';

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) throw new Error('Missing slug');
    await publishPost(slug);
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
