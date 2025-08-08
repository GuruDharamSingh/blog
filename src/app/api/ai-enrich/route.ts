import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { dbAdmin } from '@/lib/firebase/admin';

// POST { title, content, slug? } -> { summary, tags }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', content = '', slug } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    const prompt = `You are an assistant that extracts metadata for a blog post. Return compact JSON with keys: summary (<= 240 chars), tags (array of 3-6 lowercase single-word tags).\n\nTITLE: ${title}\nCONTENT:\n${content.slice(0,5000)}\n`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Extract concise metadata only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const raw = completion.choices[0]?.message?.content || '';
    let summary = '';
    let tags: string[] = [];
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        summary = parsed.summary || '';
        tags = parsed.tags || [];
      } else {
        summary = raw.slice(0,240);
      }
    } catch {
      summary = raw.slice(0,240);
    }

    if (slug && dbAdmin) {
      const docRef = dbAdmin.collection('posts').doc(slug);
      await docRef.set({ title, summary, tags, updatedAt: new Date(), draft: true }, { merge: true });
    }

    return NextResponse.json({ summary, tags });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
