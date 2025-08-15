import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { title, content } -> { summary, tags, category, meta_description }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', content = '' } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    const prompt = `You are an assistant that extracts metadata for a blog post. 

Available categories: Personal, Tech, Travel, Life, Thoughts, Projects

Return compact JSON with keys: 
- summary (concise description, <= 240 chars)
- tags (array of 3-6 lowercase single-word tags)
- category (pick the best fitting category from the list above)
- meta_description (SEO-optimized description, <= 160 chars)

TITLE: ${title}
CONTENT:
${content.slice(0,5000)}
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Extract concise metadata only. Return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const raw = completion.choices[0]?.message?.content || '';
    let summary = '';
    let tags: string[] = [];
    let category = 'Personal';
    let meta_description = '';
    
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        summary = parsed.summary || '';
        tags = parsed.tags || [];
        category = parsed.category || 'Personal';
        meta_description = parsed.meta_description || summary.slice(0, 160);
      } else {
        // Fallback if no JSON found
        summary = `${title}: ${content.slice(0, 200)}...`.slice(0, 240);
        meta_description = summary.slice(0, 160);
        tags = [];
      }
    } catch {
      // Fallback on parse error
      summary = `${title}: ${content.slice(0, 200)}...`.slice(0, 240);
      meta_description = summary.slice(0, 160);
      tags = [];
    }

    return NextResponse.json({ summary, tags, category, meta_description });
  } catch (e:any) {
    console.error('AI enrich error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
